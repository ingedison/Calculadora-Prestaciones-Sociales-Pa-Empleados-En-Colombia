using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CalculadoraLPS_Web.api
{
    public class PDFDetails
    {
        public int fileid { get; set; }
        public string uid { get; set; }
        public string filename { get; set; }
        public int filesize { get; set; }
        public string fileext { get; set; }
        public string error { get; set; }

    }
}