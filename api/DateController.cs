using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
namespace CalculadoraLPS_Web.api
{
    public class DateController : ApiController
    {
        public DateInfo GetCurrentDate()
        {
            DateInfo dateinfo = new DateInfo();
            Guid guid = Guid.NewGuid();
            dateinfo.uid = guid.ToString();
            dateinfo.cdate = DateTime.Now;
            dateinfo.scurrentDate = dateinfo.cdate.ToString("yyyy/MM/dd HH:MM:ss");
            dateinfo.scurrentDate_notime = dateinfo.cdate.ToString("yyyy/MM/dd");
            return dateinfo;
        }
    }
}
