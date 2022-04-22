using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CalculadoraLPS_Web.api
{
    public class DateInfo
    {
        public string uid { get; set; }
        public DateTime cdate { get; set; }
        public string scurrentDate { get; set; }
        public string scurrentDate_notime { get; set; }
    }
}