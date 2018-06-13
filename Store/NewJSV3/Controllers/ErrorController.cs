using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSBase.Controllers
{
    /// <summary>
    /// 自定义全局错误控制器
    /// </summary>
    public class ErrorController : Controller
    {
        //
        // GET: /Error/
        public ActionResult Index(string error)
        {
            ViewBag.Title = "Error";
            ViewBag.Description = error;
            return View();
        } 
        public ActionResult HttpError404(string error)
        {
            ViewBag.Title = "HTTP 404- can't find the file";
            ViewBag.Description = error;
            return View("Index");
        }
        public ActionResult HttpError500(string error)
        {
            ViewBag.Title = "HTTP 500 - internal error";
            ViewBag.Description = error;
            return View("Index");
        }
        public ActionResult General(string error)
        {
            ViewBag.Title = "HTTP error";
            ViewBag.Description = error;
            return View("Index");
        }
	}
}