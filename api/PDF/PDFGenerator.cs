using CalculadoraLPS_Web.api.PDF;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using iTextSharp.tool.xml.html;
using iTextSharp.tool.xml.html.table;
using iTextSharp.tool.xml.parser;
using iTextSharp.tool.xml.pipeline.css;
using iTextSharp.tool.xml.pipeline.end;
using iTextSharp.tool.xml.pipeline.html;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace CalculadoraLPS_Web.api
{
    public class PDFGenerator
    {
        public PDFDetails createpdf(DetalleLiquidacion detail)
        {
            PDFDetails pdf = new PDFDetails();
            DateTime currentdate = DateTime.Now;
            string xHtml = XTMHLString(detail);
            string css = CSString();
            Random random = new Random();
            int randomNumber = random.Next(100000, 999999);

            string OUTPUT_FILE = "liquidReport"+ currentdate.Year.ToString() + currentdate.Month.ToString() + currentdate.Day.ToString() +
                       currentdate.Hour.ToString() + currentdate.Minute.ToString() + currentdate.Second.ToString()
                       + "_" + randomNumber.ToString();
            string filename = OUTPUT_FILE + ".pdf";

            OUTPUT_FILE = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/static/documents").ToString(), (OUTPUT_FILE + ".pdf"));

            try
            {
                using (var stream = new FileStream(OUTPUT_FILE, FileMode.Create))
                {
                    using (var document = new Document())
                    {
                        var writer = PdfWriter.GetInstance(document, stream);
                        document.Open();

                        // instantiate custom tag processor and add to `HtmlPipelineContext`.
                        var tagProcessorFactory = Tags.GetHtmlTagProcessorFactory();
                        tagProcessorFactory.AddProcessor(
                            new TableDataProcessor(),
                            new string[] { HTML.Tag.TD }
                        );
                        var htmlPipelineContext = new HtmlPipelineContext(null);
                        htmlPipelineContext.SetTagFactory(tagProcessorFactory);

                        var pdfWriterPipeline = new PdfWriterPipeline(document, writer);
                        var htmlPipeline = new HtmlPipeline(htmlPipelineContext, pdfWriterPipeline);

                        // get an ICssResolver and add the custom CSS
                        var cssResolver = XMLWorkerHelper.GetInstance().GetDefaultCssResolver(true);
                        cssResolver.AddCss(css, "utf-8", true);
                        var cssResolverPipeline = new CssResolverPipeline(
                            cssResolver, htmlPipeline
                        );

                        var worker = new XMLWorker(cssResolverPipeline, true);
                        var parser = new XMLParser(worker);
                        using (var stringReader = new StringReader(xHtml))
                        {
                            parser.Parse(stringReader);
                        }
                    }
                }
                Guid guid = Guid.NewGuid();
                pdf.fileid = 0;
                pdf.uid = guid.ToString();
                pdf.filename = filename;
                pdf.fileext = "pdf";
                pdf.filesize = 0;
                pdf.error = "todo OK";

                return pdf;
            }
            catch (Exception e)
            {
                Guid guid = Guid.NewGuid();
                pdf.fileid = 0;
                pdf.uid = guid.ToString();
                pdf.filename = "NO_AVAILABLE";
                pdf.fileext = "pdf";
                pdf.filesize = 0;
                pdf.error = "error controlado: " + e.Message.ToString();  

                return pdf;
            }


        }
        private string XTMHLString(DetalleLiquidacion detail)
        {
            string XHTML = @"
                            
                            <table style='margin:5px; width:698px; height:100%; border:1px solid #00ACC8;'><tr><td>
                            <img style='width:695px; height:8px;' src='https://www.nexarte.com/templates/aura/images/hexagon.png'/> 
                            <h1 style='text-align:center;'>LIQUIDACIÓN DE PRESTACIONES SOCIALES</h1>
                            
                            <div style='background-color:#00ACC8; width:100%; height:1px; margin:10px;'></div>  
                            <table style='margin:10px;'><tr><th></th></tr></table>
                            <table style='width:100%; margin:10px;'>
                            
                            <tr><td style='text-align:center; margin-top:10px'><strong>Casua de la liquidación</strong></td></tr>
                            <tr><td style='text-align:center;'>" + causarenuncia(detail.WScausaLiquidacion) + @"</td></tr>
                            
                            <tr><td style='text-align:center;'><strong>Tipo de contrato</strong></td></tr>
                            <tr><td style='text-align:center;'>" + tipoContrato(detail.WScontractType) + @"</td></tr>

                            <tr><td style='text-align:center;'><strong>Tipo de salario</strong></td></tr>
                            <tr><td style='text-align:center;'>" + tipoSalario(detail.WSsalaryType) + @"</td></tr>            
                            </table>


                            <div style='background-color:#00ACC8; width:100%; height:1px'></div>
                            <div style='padding-left:20px;padding-right:20px;padding-top:0px;padding-bottom:0px;'> 
                            
                            <table style='width:100%; margin-top:10px;'>
                            <tr>
                            <td style='text-align:left;'><strong>Fecha de ingreso:</strong></td>
                            <td style='text-align:left;'>" + detail.WSfhInicio + @"</td>
                            <td style='text-align:left;'><strong>Fecha de liquidación:</strong></td>
                            <td style='text-align:left;'>" + detail.WSfhFin + @"</td>
                            </tr>
                            </table>

                            

                            <table style='width:100%; margin:10px;'>
                            <tr>
                            <td style='text-align:left;'><strong>Salario devengado:</strong></td>
                            <td style='text-align:left;'>" + detail.WSsalary + @"</td>
                            <td style='text-align:left;'><strong>Base liquidación:</strong></td>
                            <td style='text-align:left;'>" + detail.WSliqBase + @"</td>
                            <td style='text-align:left;'><strong>Dias trabajados:</strong></td>
                            <td style='text-align:left;'>" + detail.WSworkeddays + @"</td>
                            </tr>
                            </table>
                            </div>                    
                            <div style='background-color:#00ACC8; width:100%; height:1px'></div>  
                            <div style='padding:20px;'>

                             <div style='background-color:#01ACC8; width:100%; height:38px; margin:25px;padding-top:10px'>
                                <h3 style='text-align:center; color:white; width:690px; padding:0px;'> DETALLE DE LIQUIDACIÓN </h3>
                            </div>

                            <table style='width:100%; background-color: #01ACC8;'>
                            <tr>
                            <td>   


                            <table class='liquidation' style='width:100%;'>
                            <tr style='height:30px; color:white; background-color:#01ACC8; padding:10px'>
                            <th style=' padding:10px'>Concepto</th>
                            <th style=' padding:10px'>Dias</th>
                            <th style=' padding:10px'>Total</th>
                            </tr>
                            <tr class='odd'>
                                <td>Cesantías </td> <td>" + detail.WSworkeddays + " </td> <td>" + detail.WScesantias + @"</td>
                            </tr>
                            <tr class='even'>
                                <td>Intereses de cesantías </td> <td>" + detail.WSworkeddays + " </td> <td>" + detail.WSicensantias + @"</td>
                            </tr>
                            <tr class='odd'>
                                <td>Prima de servicios </td> <td>" + detail.WSworkeddays + " </td> <td>" + detail.WSprimaServicios + @"</td>
                            </tr>
                            <tr class='even'>
                                <td>Vacaciones </td> <td>" + detail.WSvacationDays + " </td> <td>" + detail.WSvacationPay + @"</td>
                            </tr>
                            <tr class='odd'>
                                <td>Otros ingresos mensaules </td> <td>" + detail.WSworkeddays + " </td> <td>" + detail.WSotrosIngMens + @"</td>
                            </tr>
                            <tr style='background-color:#EF5F45; color:white;'>
                                <td>Deducciones pendientes </td> <td>" + detail.WSworkeddays + " </td> <td>" + detail.WSdeducPending + @"</td>
                            </tr>
                            <tr class='odd'>
                                <td>Indemnización por despido </td> <td>" + detail.WSindespidoDays + " </td> <td>" + detail.WSindespido + @"</td>
                            </tr>
                            <tr style='height:30px; color:white; background-color:#01ACC8; padding:15px'>
                                <th style='padding:15px'>Toal Liquidación </th> <th> </th> <th style='padding:15px'>" + detail.WStotalLiq + @"</th>
                            </tr>
                            </table>
                            <br/>
                              </td></tr></table>
</div>
<br/>
<div style='padding-left:20px;padding-right:20px;padding-top:0px;padding-bottom:0px;'> 
                            <table style='border: dashed 1px #EF5F45; width:100%'> <tr> <td style='padding:10px; color:black; text-align:justify; '>
                            <p> Nota: Los valores determinados por este simulador, obedecen a una suma estimada, acorde a la información registrada por el consultante y bajo ninguna circunstancia constituyen una liquidación oficial por parte de la compañía, ni un estimativo de esta, razón por la cual no podrá ser insumo para la realización de solicitudes o reclamaciones.</p>
                            </td></tr></table>
</div><br/>
<img style='width:695px; height:8px;' src='https://www.nexarte.com/templates/aura/images/hexagon.png'/> 
                        </td></tr></table> ";
            return XHTML;
        }
        private string CSString()
        {
            string CSS = @"
                            body {font-size: 12px; font-family:Roboto,sans-serif; border:1px solid #00ACC8;}
                            table {border-collapse:collapse;}
                            .light-yellow {background-color:#ffff99;}
                            .liquidation td {padding:8px;}
                            .odd {
                              background-color: #fff !important;
                            }
                            .even {
                              background-color: #eee !important;
                            }
                               
                        ";
            return CSS;
        }
        private string causarenuncia(int renunCause)
        {

            switch (renunCause)
            {
                case 1:
                    return ("Renuncia Voluntaria");
                case 2:
                    return ("Vencimiento de Término del Contrato");
                case 3:
                    return ("Terminación del Contrato sin justa causa");
                case 4:
                    return ("Terminación del Contrato con justa causa");
                default:
                    return ("data no available");

            }
        }

        private string tipoContrato(int typeCont)
        {

            switch (typeCont)
            {
                case 1:
                    return "Contrato a término fijo";
                case 2:
                    return "Contrato a término indefinido";
                default:
                    return "data no available";
            }
        }
        private string tipoSalario(int typeSalary)
        {

            switch (typeSalary)
            {
                case 0:
                    return "Normal";
                case 1:
                    return "Integral";
                default:
                    return "data no available";
            }
        }
    }



}