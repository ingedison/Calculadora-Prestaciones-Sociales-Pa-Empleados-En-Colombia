using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CalculadoraLPS_Web.api
{
    public class SalaryInfo
    {
        public int Id { get; set; }
        public string uid { get; set; }
        public int anio { get; set; }
        public string CurrentMinSalary { get; set; }
        public string Auxtransporte { get; set; }
    }
}