using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CalculadoraLPS_Web.api
{
    public class SalariominimoController : ApiController
    {
        public SalaryInfo Get_infosalminimo(){
            SalaryInfo salinfo = new SalaryInfo();
            Guid guid = Guid.NewGuid();
            salinfo.uid = guid.ToString();
            salinfo.anio = DateTime.Now.Year;
            salinfo.CurrentMinSalary = "781242";
            salinfo.Auxtransporte = "88211";

            return salinfo;
        }


    }
}
