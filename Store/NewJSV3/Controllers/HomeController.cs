using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JTS.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using JSBase;

namespace JSBase.Controllers
{
    //[AllowAnonymous]
    public class HomeController : BaseController
    {



        public void MyInitSession()
        {
            Session.Timeout = 3000;
            try
            {
                if (CurrentUser != null)
                {

                    Session["add_by"] = CurrentUser.UserId.ToString();
                    Session["sstore_id"] = CurrentUser.DepartmentID.ToString();
                    Session["add_by"] = CurrentUser.UserId.ToString();
                    Session["user_id"] = CurrentUser.UserId.ToString();
                    Session["scompany_id"] = CurrentUser.DepartmentCode.ToString();
                    Session["sparentid"] = CurrentUser.DepartmentCode.ToString();
                    Session["sdepartment_id"] = CurrentUser.DepartmentCode.ToString();
                }

            }
            catch (Exception e)
            {
                Session["add_by"] = -1;
                Session["sstore_id"] = -1;
                Session["add_by"] = -1;
                Session["user_id"] = -1;
                Session["scompany_id"] = -1;
                Session["sparentid"] = -1;
                Session["sdepartment_id"] = -1;
            }


            HttpCookie cookie = Request.Cookies.Get("language");
            if (cookie == null)
            {
                Session["slanguage"] = GetLanguage();
            }
            else
            {

                Session["slanguage"] = cookie.Value;
            }


        }
        public HomeController()
        {
            InitSession = new CallBackFun(MyInitSession);
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;
        }
        //首页
        public ActionResult admin(string timestamp)
        {
            if (!FormsAuth.IsAuthenticated)
                return RedirectToAction("Index", "Login");

            initLan();

            ViewBag.Token = CreateToken();
            ViewBag.user_info = JTS.Utils.DESEncrypt.Encrypt("/sys/sysbase]user_info", EncryptKey);
            var loginer = FormsAuth.GetBaseLoginerData();
            ViewBag.Title = System.Configuration.ConfigurationManager.AppSettings["title"].ToString(); ;
            ViewBag.UserId = loginer.UserId;
            ViewBag.UserCode = loginer.UserCode;
            ViewBag.UserName = loginer.UserName;
            // ViewBag.navigation = "menubutton";
            ViewBag.navigation = "accordion";
            ViewBag.Settings = new { gridrows = 20, navigation = "accordion" };
            if (CurrentUser.DepartmentCode.Length > 0)
                ViewBag.LoginUser = "[" + loginer.UserCode + "]" + loginer.UserName + "-" + CurrentUser.DepartmentCode;
            else
                ViewBag.LoginUser = "[" + loginer.UserCode + "]" + loginer.UserName;
            ViewBag.EasyuiVersion = JTS.Utils.ConfigUtil.GetConfigString("EasyuiVersion");//easyui版本
            ViewBag.SystemVersion = JTS.Utils.ConfigUtil.GetConfigString("SystemVersion");//系统版本
            CookiesUtil.WriteCookies("EasyuiTheme", 0, "");
            CookiesUtil.WriteCookies("EasyuiVersion", 0, JTS.Utils.ConfigUtil.GetConfigString("EasyuiVersion"));

            JObject data = new JObject();
            data["role_ids"] = loginer.RoleIDs;
            data["slanguage"] = Session["slanguage"].ToString();
            DataSet dt = base.RunProcedureDataSet(data, "vdp_get_menu", "sys");
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;

            foreach (DataRow r in dt.Tables[0].Rows)
            {
                r["menu_token"] = Server.UrlEncode(JTS.Utils.DESEncrypt.Encrypt(r["url"] + "]" + r["menu_code"], EncryptKey));
            }


            var model = new
            {
                //  userSettings = userSettings,
                UserId = loginer.UserId,
                UserCode = loginer.UserCode,
                UserName = loginer.UserName//,
                //  UserMenus2 =Dtb2Json( dt.Tables[0])
            };

            ViewBag.UserMenus = Dtb2Json(dt.Tables[0]);
            return View(model);
        }

        [AllowAnonymous]
        public ActionResult register()
        {
            initLan();

            return View();
        }

        [AllowAnonymous]
        public JsonResult Query(JObject data)
        {

            string sort = Request.Params.Get("sort");
            if (sort == null)
                sort = "";
            string order = Request.Params.Get("order");
            if (order == null)
                order = "";

            int pageIndex = data.Value<int>("page");
            int pageSize = data.Value<int>("rows");
            int pageCount = 0;
            int totalRows = 0;
            ProcInfo pinfo = new ProcInfo();
            pinfo.ProcedureName = "vdp_search_breed";
            pinfo.SQL = "";
            pinfo.Type = "proc";
            var list = ListDataPager(sort, order, pageIndex, pageSize, out pageCount, out totalRows, pinfo, data);
            return JsonNet(new { rows = list, total = totalRows });


        }
        [AllowAnonymous]
        public ActionResult Detail(string id)
        {
            ViewBag.Message = "Your application description page.";
            ProcInfo pinfo = new ProcInfo();
            pinfo.ProcedureName = "vdp_get_review_detail";
            pinfo.SQL = "";
            pinfo.Type = "proc";
            JObject data = new JObject();
            data["id"] = id;
            var d = RunProcedureDataTable(data, pinfo);
            ViewData["DetailData"] = d;

            return View();
        }

        [AllowAnonymous]
        public ActionResult Index(string mc)
        {
            initLan();
            JObject data2 = new JObject();
            data2["slanguage"] = Session["slanguage"].ToString();
            DataTable dt3 = base.RunProcedureDataTable(data2, "vdp_get_home_menu");
            ViewData["menu"] = dt3;
            if (mc != null && mc.Trim().Length > 0)
            {
            }
            else
                mc = "index_lan";
            ViewData["mc"] = mc;

            mc = mc.Replace("_lan", "_lan@" + Session["slanguage"].ToString());
            return BaseIndexA(mc);
        }
        [AllowAnonymous]
        public JsonResult RegisterMe(JObject data)
        {
            data["slanguage"] = Session["slanguage"].ToString();
            string result = RunProcedure(data, new ProcInfo("vdp_user_register", "app"));
            if (isNumberic(result))
                return JsonNet(new { s = true, message = GetSysText("success") }, JsonRequestBehavior.DenyGet);
            else
                return JsonNet(new { s = false, message = result }, JsonRequestBehavior.DenyGet);

        }
        public ActionResult Portal()
        {
            ViewBag.Message = System.Configuration.ConfigurationManager.AppSettings["title"].ToString(); ;
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        //修改自己密码
        //POST /Home/ModifySelfPassword
        public JsonResult ModifySelfPassword(JObject data)
        {
            string UserCode = CurrentUser.UserCode;
            string Password = data.Value<string>("newpassword");
            data["UserCode"] = UserCode;
            data["Password"] = Md5Util.MD5(Password);
            base.RunProcedureByName(data, "vdp_reset_pwd", "app");
            return Json(new { s = true, message = GetSysText("success") }, JsonRequestBehavior.DenyGet);
        }
    }
}