using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CalculadoraLPS_Web.api
{
    public class DetalleLiquidacion
    {
        public int WSidLiquidacion { get; set; }
        public string WSsalary { get; set; }
        public string WSauxTransporte { get; set; }
        public string WSotrosIngMens { get; set; }
        public string WSliqBase { get; set; }
        public string WScesantias { get; set; }
        public string WSicensantias { get; set; }
        public string WSprimaServicios { get; set; }
        public string WSvacationPay { get; set; }
        public string WSvacationDays { get; set; }
        public string WSdeducPending { get; set; }
        public string WSfhInicio { get; set; }
        public string WSfhFin { get; set; }
        public int WScausaLiquidacion { get; set; }
        public int WScontractType { get; set; }
        public int WSsalaryType { get; set; }
        public string WStotalLiq { get; set; }
        public int WSworkeddays { get; set; }
        public string WSindespido { get; set; }
        public string WSindespidoDays { get; set; }
        public string WSValorAntCes { get; set; }

    }
}