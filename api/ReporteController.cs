using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CalculadoraLPS_Web.api
{
    public class ReporteController : ApiController
    {
        [HttpPost]
        public PDFDetails Post([FromBody]DetalleLiquidacion detalle)
        {

            PDFDetails pdf = new PDFDetails();
            
            PDFGenerator pdfgen = new PDFGenerator();
            pdf = pdfgen.createpdf(detalle);
            return pdf;
        }
    }
}
