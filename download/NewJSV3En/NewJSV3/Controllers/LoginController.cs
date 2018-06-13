using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using JTS.Utils;
using JSBase;
using System.Data.Sql;
using System.Data;

using Newtonsoft.Json;
using System.Configuration;

namespace JSBase.Controllers
{
    [AllowAnonymous]
    public class LoginController : BaseController
    {
        public ActionResult Index()
        {
            if (FormsAuth.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            return KM();
        }

        public ActionResult KM()
        {
          //  HttpCookie cookie = Request.Cookies.Get("language");
          //  if (cookie == null)
          //  {
          //      Session["slanguage"] = GetLanguage();
          //  }
          //  else
          //  {

          //      Session["slanguage"] = cookie.Value;
          //  }

          ////  ProcInfo pinfo2 = new ProcInfo("vdp_sys_get_text", "sys");
          //  JObject data2 = new JObject();
          //  data2["menu_code"] = "";
          //  data2["slanguage"] = Session["slanguage"].ToString();
          // // SetData(pinfo2, data2);

          //  DataTable dt = base.RunProcedureDataTable(data2, "vdp_sys_get_text");
          //  ViewData["dictionary"] = dt;


            initLan();
            JObject data2 = new JObject();
            data2["menu_code"] = "";
            data2["slanguage"] = Session["slanguage"].ToString();
            DataTable dt2 = base.RunProcedureDataTable(data2, "vdp_sys_get_text");
            ViewData["dictionary"] = dt2;

            ViewBag.Title = ConfigurationManager.AppSettings["title"].ToString();
            ViewBag.LoginType = "login";
            if (Request.Params["utoken"] != null)
            {

                ViewBag.LoginType = "active";
                data2["utoken"] = Request.Params["utoken"].ToString();
               // data2["utoken"] = Request.Params["utoken"].ToString();
                DataTable dt3 = base.RunProcedureDataTable(data2, "vdp_active_account");

            } 
            if (Request.Params["rutoken"] != null)
            {

                ViewBag.LoginType = "reset";
                data2["rutoken"] = Request.Params["rutoken"].ToString();
               // data2["utoken"] = Request.Params["utoken"].ToString();
                DataTable dt3 = base.RunProcedureDataTable(data2, "vdp_reset_account");

            }
            //ViewBag.EnName = "KM EnterpriseRapid Development Framework.";
            //CookiesUtil.RemoveCookie("KMAUTH");
            //CookiesUtil.RemoveCookie("EasyuiTheme");
            //CookiesUtil.RemoveCookie("EasyuiVersion");
            //DataTable dt3 = base.RunProcedureDataTable(data2, "vdp_list_text_language");

            //var jason = JsonConvert.SerializeObject(JsonNet(dt3).Data, Newtonsoft.Json.Formatting.Indented, this.IsoDateTimeConverter);

            //// ViewData[dr["action_url_name"].ToString()] = jason.Replace("\r\n", "").Replace("&quot;", "'");
            //ViewData["language_list"] = jason.Replace("\r\n", "").Replace("&quot;", "'"); ;
            return View("Index");
        }

        public ActionResult JTS()
        {
            //ViewBag.EnName = "LincChic Shop Service System";
            return View("Index");
        }
        public JsonResult ForgetPWD(JObject data)
        {  
            data["slanguage"] = Session["slanguage"].ToString();
            DataTable dt2 = base.RunProcedureDataTable(data, "vdp_retrive_password");
            if (dt2.Rows[0]["amount"].ToString()!= "0")
                return Json(new { s = 1, message = GetSysText("success") }, JsonRequestBehavior.DenyGet);
            else
                return Json(new { s = 0, message = GetSysText("failed") }, JsonRequestBehavior.DenyGet);

        }
        // POST: /Login/
        public JsonResult Login(JObject data)
        {
            string UserCode = data.Value<string>("user_code");
            string Password = data.Value<string>("password");
            string IP = data.Value<string>("ip");
            string City = data.Value<string>("city");
            data["user_code"] = UserCode;
            data["password"] = Md5Util.MD5(Password);
            data["LoginIP"] = IP;
            data["LoginCity"] = City;

            AppConnectionString = ConfigurationManager.ConnectionStrings["app"].ConnectionString;
            DataSet dt = base.RunProcedureDataSet(data, "vdp_sys_Login", "app");
            //if (dt.Rows.Count > 0)
            var ResultID =  dt.Tables[0].Rows[0]["result_id"];
            var ResultMsg = (string)dt.Tables[0].Rows[0]["result_msg"];
            //var loginResult = Base_UserService.Instance.Login(UserCode, Md5Util.MD5(Password), IP, City);
            if ( ResultID.ToString() == "0")
            {
                ////登录成功后，查询当前用户数据 
                //var user = Base_UserService.Instance.GetEntity(ParamQuery.Instance()
                //                .AndWhere("UserCode", UserCode).AndWhere("Password", Md5Util.MD5(Password))
                //                .AndWhere("Enabled", 1).AndWhere("IsAudit", 1));
                //user.DepartmentCode = "";

                //调用框架中的登录机制
                Base_User b = new Base_User();
                b.city = "";// (string)dt.Rows[0]["city"];
                b.RealName = (string)dt.Tables[1].Rows[0]["real_name"];
                b.DepartmentID = (int)dt.Tables[1].Rows[0]["department_id"];
                b.UserId = (int)dt.Tables[1].Rows[0]["id"];
                b.UserCode = (String)dt.Tables[1].Rows[0]["user_code"];

                b.RoleIDs = (string)dt.Tables[1].Rows[0]["role_ids"];
                b.DepartmentCode = ((int)dt.Tables[1].Rows[0]["department_id"]).ToString();
                var loginer = new BaseLoginer
                {
                    UserId = (int)dt.Tables[1].Rows[0]["id"],//. user.UserId,
                    UserCode = (string)dt.Tables[1].Rows[0]["user_code"],// user.UserCode,
                  //  Password = (string)dt.Tables[1].Rows[0]["Password"],// user.Password,
                    UserName = (string)dt.Tables[1].Rows[0]["real_name"],// user.RealName,
                    RoleIDs = (string)dt.Tables[1].Rows[0]["role_ids"],
                    //  DepartmentCode =((int)dt.Tables[1].Rows[0]["DepartmentID"]).ToString(),
                    Data = b,
                    IsAdmin = false// user.UserType == 1  //根据用户UserType判断。用户类型：0=未定义 1=超级管理员 2=普通用户 3=其他
                };


                Session["logininfo"] = "";


                //读取配置登录默认失效时长：小时
                var effectiveHours = Convert.ToInt32(60 * ConfigUtil.GetConfigDecimal("LoginEffectiveHours"));


                //执行web登录
                FormsAuth.SignIn(loginer.UserId.ToString(), loginer, effectiveHours);
                LogHelper.Write("登录成功！用户：" + loginer.UserName + "，账号：" + UserCode + "，密码：---");
                //设置服务基类中，当前登录用户信息
                //this.CurrentBaseLoginer = loginer;
                //登陆后处理
                //更新用户登陆次数及时间（存储过程登录，数据库已经处理）
                //添加登录日志
                string userinfo = string.Format("用户姓名：{0}，用户编号：{1}，登录账号：{2}，登录密码：{3}",
                    loginer.UserName, loginer.UserId, loginer.UserCode, "---"/*loginer.Password*/);
                // Base_SysLogService.Instance.AddLoginLog(userinfo, IP, City);
                //更新其它业务
            }
            else
            {
                LogHelper.Write("登录失败！账号：" + UserCode + "，密码：" + Password + "。原因：" + ResultMsg);
            }
            return Json(new { s = ResultID, message = ResultMsg }, JsonRequestBehavior.DenyGet);
        }

        // POST: /Login/LogOff
        public ActionResult LogOff()
        {
            var loginer = FormsAuth.GetBaseLoginerData();
            LogHelper.Write("退出系统！账号：" + loginer.UserCode + "，姓名：" + loginer.UserName);
            string userinfo = string.Format("用户姓名：{0}，用户编号：{1}，登录账号：{2}，登录密码：{3}",
                 loginer.UserName, loginer.UserId, loginer.UserCode, loginer.Password);
            //   Base_SysLogService.Instance.AddLogoutLog(userinfo, "", "");
            FormsAuth.SignOut();
            return Redirect("/");
        }

        // GET: /Login/CheckLogin
        public JsonResult CheckLogin(string _t)
        {
            var result = new { s = FormsAuth.IsAuthenticated };
            return Json(result, JsonRequestBehavior.AllowGet);
        }


    }
}