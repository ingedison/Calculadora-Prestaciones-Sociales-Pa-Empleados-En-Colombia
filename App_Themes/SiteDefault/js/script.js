//initialize vue instance

Vue.component('datatable',
{
    data: function()
    {
        return {
            esptd_Class: 'especialtd',
            table_Footer: 'table-footer',
            redTd: 'redTd'
        }
    },
    props: ['_item', 'headers'],
    template: '                               <v-data-table  ' +
        '                                 :headers="headers"  ' +
        '                                 :items="_item"  ' +
        '    hide-actions' +
        '                                   style="border:1px #00ACC8 solid"  ' +
        '                               >  ' +
        '                                   <template slot="items" slot-scope="props">  ' +
        '                                        <td class="text-xs-left" v-bind:class="[ {\'especialtd\' : (props.item.CssClass) } , {\'table-footer\' : (props.item.tableFooter) }, {\'redTd\' : (props.item._redTd) } ]" > {{ props.item.Concept }} </td>   ' +
        '                                         <td class="text-xs-left" v-bind:class="[ {\'especialtd\' : (props.item.CssClass) }, {\'table-footer\' : (props.item.tableFooter) }, {\'redTd\' : (props.item._redTd) } ]"  >{{ props.item.Days }} </td>  ' +
        '                                         <td class="text-xs-left" v-bind:class="[ {\'especialtd\' : (props.item.CssClass) }, {\'table-footer\' : (props.item.tableFooter) }, {\'redTd\' : (props.item._redTd) } ]"  >{{ props.item.Total }} </td>  ' +
        '                                       </template>  ' +
        '                                       <template slot="no-data">  ' +
        '                                             <v-alert :value="true" color="error" icon="warning">  ' +
        '                                              ¡Lo sentimos, no hay datos para mostrar aquí!  ' +
        '                                             </v-alert>  ' +
        '                                           </template>  ' +
        '                              </v-data-table>  '

});

new Vue(
{
    el: '#app',
    data: function data()
    {
        return {
            e1: 1,
            t_days: 0,
            valid: true,

            aux_trans: 0,
            min_salary: 0,
            vSal_Base: 0,
            OingMens: 0,
            vTextB_vca: 0,
            pendingDeduc: 0,
            vac_days: 0,
            contracType_radio: 1,
            ChkSalintegral: false,
            ChkImdespido: false, 
            liquidationDetail:{},
            imdespido: 0,
            date_ini: null,
            date_fin: null,
            date_ter: null,
            show:false,
            steps: 3,
            reportLink:'',

            dateTermdis: true,
            reqTerdate: false,
            select: null,
            valid: true,


            menu1: false,
            modal: false,
            menu2: false,
            menu3: false,
            dialog: false,
            loader: null,
            loading: false,

            days:
            {
                decimal: '',
                thousands: '',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false /* doesn't work with directive */
            },
            money:
            {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            iSal_BaseRules: [
                v => !!v  || 'Salario base es requerido',
                v => (v.length < 16) || 'El campo salario no debe contener más de 15 digitos',
                v => (validateSalariointegral(this.vSal_Base, this.min_salary, this.ChkSalintegral)) || 'Salario integral debe ser superior o igual a 13 SMLV'
            ],
            date_Rules: [
                v => !!v || 'Fecha requerida',
                v => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'La fecha no tiene formato válido',
                v => (datesvalid(this.date_ini, this.date_fin)) || 'La fecha de inicio no puede ser mayor a la fecha de terminación/liquidación'
            ],

            headers: [
            {
                text: 'Concepto',
                align: 'left',
                sortable: false,
                value: 'Concept'
            },
            {
                text: 'Días',
                align: 'left',
                sortable: false,
                value: 'Days'
            },
            {
                text: 'Total',
                align: 'left',
                sortable: false,
                value: 'Total'
            }],

            dtitems: [],

            items: [
            {
                text: 'Renuncia Voluntaria',
                value: 1
            },
            {
                text: 'Vencimiento de Término del Contrato',
                value: 2
            },
            {
                text: 'Terminación del Contrato sin justa causa',
                value: 3
            },
            {
                text: 'Terminación del Contrato con justa causa',
                value: 4
            }]


        };
    },
    watch:
    {
        loader()
        {
            const l = this.loader;
this[l] = !this[l];
setTimeout(() => (this[l] = false), 3000);
this.loader = null;
}

},
methods:
    {
        doCalc(n)
        {

            if (this.$refs.form.validate())
            {
                this.show = false;
                var strDate, endDate;
                var regex = new RegExp('-', 'g');
                var baseSalary = formatFloat(this.vSal_Base);
                baseSalary = parseFloat(baseSalary).toFixed(2);

                strDate = (this.date_ini === null) ? new Date() : new Date(this.date_ini.replace(regex, "/"));
                endDate = (this.date_fin === null) ? new Date() : new Date(this.date_fin.replace(regex, "/"));

                var auxtransport = (parseFloat(baseSalary) <= ((parseFloat(formatFloat(this.min_salary)).toFixed(2) * 2))) ? parseFloat(formatFloat(this.aux_trans)).toFixed(2) : 0;

                var oTingmens = formatFloat(this.OingMens);
                var pendingDed = formatFloat(this.pendingDeduc);
                oTingmens = parseFloat(oTingmens).toFixed(2);
                var liqbase = (parseFloat(baseSalary) + parseFloat(oTingmens)).toFixed(2);

                console.log(liqbase);

                this.liquidationDetail = calcLiquidation(baseSalary,liqbase, this.t_days, this.min_salary, auxtransport, this.currentdate, strDate, endDate, this.vac_days, pendingDed, this.ChkImdespido, this.ChkSalintegral);

                this.dtitems = _getJsonReport(formatMoney(baseSalary), formatMoney(auxtransport), formatMoney(oTingmens), formatMoney(this.liquidationDetail.baseLiq), formatMoney(this.liquidationDetail.cesantias), formatMoney(this.liquidationDetail.icesantias), formatMoney(this.liquidationDetail.primaServicios), formatMoney(this.liquidationDetail.vacations.vacationPay), this.t_days, formatMoney(this.liquidationDetail.vacations.vacationDays), formatMoney(this.liquidationDetail.imdespido.indem), this.liquidationDetail.imdespido.days, formatMoney(pendingDed), formatMoney(this.liquidationDetail.totalLiquidacion));

                this.loader = 'loading';

                var self = this;

                setTimeout(function()
                {
                    if (n === self.steps)
                    {
                        self.e1 = 1
                    }
                    else
                    {
                        self.e1 = n + 1
                    }
                }, 3000);
            }

        },
        calcDays(refs, dateSelector)
        {
            var regex = new RegExp('-', 'g');
            var startDate = (this.date_ini === null) ? "" : new Date(this.date_ini.replace(regex, "/"));
            var endDate = (this.date_fin === null) ? "" : new Date(this.date_fin.replace(regex, "/"));

            //SET DATES INTO INPUTS
            if (dateSelector === "start")
                refs.menu1.save(this.date_ini);
            else if (dateSelector === "end")
                refs.menu2.save(this.date_fin);

            if ((Object.prototype.toString.call(startDate) === "[object Date]") && (Object.prototype.toString.call(endDate) === "[object Date]"))
            {
                //CALC DAYS TIMESPAN BETWEEN BOTH DATES
                if (!isNaN(startDate.getDate()) && !isNaN(endDate.getDate()))
                {
                    this.t_days = calcTimespanDays(startDate, endDate);
                }
            }

            if (this.contracType_radio == 1)
                this.date_ter = this.date_fin;

            this.$refs.form.validate();

        },
        dovalidations(){
            this.$refs.form.validate();
        },
        nocalcDays(refs)
        {

            refs.menu3.save(this.date_ter);
        },
        handle_FHTerm()
        {
            console.log("input was clicked");
            //event.stopPropagation();
            //event.preventDefault();
        },
        radChange()
        {
            if (this.contracType_radio == 1)
            {
                this.dateTermdis = true;
                this.reqTerdate = false;
            }
            else if (this.contracType_radio == 2)
            {
                this.dateTermdis = false;
                this.reqTerdate = true;
            }
            else
            {
                this.dateTermdis = false;
                this.reqTerdate = true;
            }

        },
        downpdf(){
            this.loader = 'loading';
            //this.$router.push({name: this.reportLink}); 
        },
        postDatapdf(n)
        {
            var regex = new RegExp('-', 'g');
            var dataUri = document.location.protocol + '//' + document.location.host + '/api/reporte';
            var data = {
                WSsalary: this.vSal_Base,
                WSauxTransporte: this.aux_trans,
                WSotrosIngMens: this.OingMens,
                WSliqBase: formatMoney(this.liquidationDetail.baseLiquidacion),
                WScesantias: formatMoney(this.liquidationDetail.cesantias),
                WSicensantias: formatMoney(this.liquidationDetail.icesantias),
                WSprimaServicios: formatMoney(this.liquidationDetail.primaServicios),
                WSvacationPay: formatMoney(this.liquidationDetail.vacations.vacationPay),
                WSvacationDays: formatMoney(this.liquidationDetail.vacations.vacationDays),
                WSdeducPending: this.pendingDeduc,
                WSfhInicio: String(this.date_ini.replace(regex, '/')),
                WSfhFin: String(this.date_fin.replace(regex, "/")),
                WScontractType: parseInt(this.contracType_radio),
                WStotalLiq: formatMoney(this.liquidationDetail.totalLiquidacion),
                WScausaLiquidacion: parseInt(this.select),
                WSsalaryType: (this.ChkSalintegral) ? 1 : 0,
                WSworkeddays : (this.t_days),
                WSindespido : this.liquidationDetail.imdespido.indem,
                WSindespidoDays: this.liquidationDetail.imdespido.days,
                WSValorAntCes: this.liquidationDetail.valorAntCes
            }
            var self = this;
            axios(
                {
                    method: 'post',
                    url: dataUri,
                    data: data
                })
                .then(function(response)
                {
                    setTimeout(function()
                    {
                        self.show = true;
                        var respJosn = 
                        self.reportLink = String("static/documents/"+ response.data.filename);
                    }, 3000);
                    console.log(response);

                })
                .catch(function(error)
                {
                    console.log(error);
                });

            this.loader = 'loading';

            var self = this;

            setTimeout(function()
            {
                if (n === self.steps)
                {
                    self.e1 = 1
                }
                else
                {
                    self.e1 = n + 1
                }
            }, 3000);
            /*if (n === this.steps) {
                this.e1 = 1
            } else {
                this.e1 = n + 1
            }*/
        }
    },
created: function()
{

    var minSalInfo = _getMinSalary_AuxTrans();
    this.aux_trans = (typeof minSalInfo === 'object') ? formatMoney(parseFloat(minSalInfo.Auxtransporte).toFixed(2)) : 0;
    this.min_salary = (typeof minSalInfo === 'object') ? formatMoney(parseFloat(minSalInfo.CurrentMinSalary).toFixed(2)) : 0;
    this.currentdate = _currentDateTime();


    if (this.aux_trans == 0 || this.min_salary == 0)
        this.dialog = true;

    this.currentdate = (this.currentdate === 'object') ? this.currentdate : new Date();

}

});

//Business Logic Functions (On client side)

function calculateCesantias(baseSalary, days, minsal, auxtr)
{
    var auxtransport = (parseFloat(baseSalary) <= ((parseFloat(formatFloat(minsal)).toFixed(2) * 2))) ? parseFloat(auxtr).toFixed(2) : 0;
    baseSalary = (typeof baseSalary === 'string') ? parseFloat(baseSalary) : baseSalary;
    auxtransport = (typeof auxtransport === 'string') ? parseFloat(auxtransport) : auxtransport;
    return (((parseFloat(baseSalary) + parseFloat(auxtransport)) * parseInt(days)) / 360).toFixed(2)
}

function calculateIcensantias(cesantias, days)
{
    return ((parseFloat(cesantias) * parseInt(days) * 0.12) / 360).toFixed(2);
}

function calculatePrimaservicios(salary, cdate, startdate, enddate, minsal, auxtr)
{ //Salario mensual * Días trabajados en el semestre/360
    var startCurrentHalfYear = false;
    var liq_HalfYear = 1;

    if (startdate > cdate)
    {
        var totalDays = calcTimespanDays(startdate, enddate) + 1;
        return (((parseFloat(salary) + parseFloat(auxtr)) * totalDays) / 360).toFixed(2);
    }


    if (cdate.getFullYear() == enddate.getFullYear())
    {
        liq_HalfYear = ((enddate.getMonth() + 1 <= 6) ? 1 : ((enddate.getMonth() + 1 >= 7 && enddate.getMonth() + 1 < 12) ? 2 : 0));
        var startHalfYear = ((startdate.getMonth() + 1 <= 6) ? 1 : ((startdate.getMonth() + 1 >= 7 && startdate.getMonth() + 1 <= 12) ? 2 : 0));
        startCurrentHalfYear = (cdate.getFullYear() == startdate.getFullYear()) ? true : false;
        startCurrentHalfYear = (startCurrentHalfYear) ? ((liq_HalfYear == startCurrentHalfYear) ? true : false) : false;

        var initialPrimaFH = "";
        var tdays_halfYear = 0;
        minsal = formatFloat(minsal);
        var auxtransport = (parseFloat(salary) <= ((parseFloat(minsal).toFixed(2) * 2))) ? parseFloat(auxtr).toFixed(2) : 0;


        if (startCurrentHalfYear)
        {
            tdays_halfYear = calcTimespanDays(startdate, enddate);
        }
        else
        {
            initialPrimaFH = (liq_HalfYear == 1) ? new Date(enddate.getFullYear() + "/01/01") : new Date(enddate.getFullYear() + "/07/01");
            tdays_halfYear = calcTimespanDays(initialPrimaFH, enddate);
        }

        salary = (typeof salary === 'string') ? parseFloat(salary) : salary;
        auxtransport = (typeof auxtransport === 'string') ? parseFloat(auxtransport) : auxtransport;

        return (((parseFloat(salary) + parseFloat(auxtransport)) * tdays_halfYear) / 360).toFixed(2);

    }

}

function calcVacations(baseSalary, liqdays, pendingdays, currentDate, strDate, endDate, autocalc)
{

    if (pendingdays > 0)
    {
        return {
            vacationPay: (((baseSalary / 30) * pendingdays).toFixed(2)),
            vacationDays: pendingdays
        };
    }
    else
    {
        var vacationPay = 0;
        var vacDays = 0;

        if (autocalc)
        {
            var workeddaystoActual = calcTimespanDays(strDate, currentDate);
            pendingdays = workeddaystoActual;
            if (workeddaystoActual > 360){
                for (var iyear=360; iyear<=workeddaystoActual; iyear+=360){
                    pendingdays -= 360; 
                }
                workeddaystoActual = pendingdays;
            }

            var timeLeft = (calcTimespanDays(currentDate.addDays(1), endDate)) + 1;
            var totalDays = (workeddaystoActual + timeLeft);
            vacDays = ((totalDays * 15) / 360).toFixed(2);
            return {
                vacationPay: ((parseFloat(baseSalary) / 30) * vacDays).toFixed(2),
                vacationDays: vacDays
            };
        }
        else
        {
            var workeddaystoEnd = calcTimespanDays(strDate, endDate);
            pendingdays = workeddaystoEnd;
            if (workeddaystoEnd > 360){
                for (var iyear=360; iyear<=workeddaystoEnd; iyear+=360){
                    pendingdays -= 360; 
                }
                workeddaystoEnd = pendingdays;
            }

            vacDays = ((workeddaystoEnd * 15) / 360).toFixed(2);
            return {
                vacationPay: ((parseFloat(baseSalary) / 30) * vacDays).toFixed(2),
                vacationDays: vacDays
            };


        }

    }

}

function calcIndemnizacionDespido(baseLiquidacion,totalDays,startDate, currentDate, endDate, salIntegral){
    //var indemnizacion_years = {};
    //baseLiquidacion = formatFloat(baseLiquidacion);
   // baseLiquidacion = parseFloat(baseLiquidacion).toFixed(2);

    if (totalDays <= 360){
        return {days:30,
            indem: (salIntegral) ? ((parseFloat(baseLiquidacion)/30) * 20).toFixed(2): baseLiquidacion};
    }
else{
        var pendingdays = totalDays;
        var year= 1;
        var days = 0;
        var totalindem = 0;

        for (var iyear=360; iyear < totalDays; iyear+=360) {
            if (year==1){
                totalindem = totalindem + (salIntegral) ? ((parseFloat(baseLiquidacion)/30) * 20).toFixed(2) : parseFloat(baseLiquidacion).toFixed(2);
                days= (salIntegral) ? 20 : 30;
            }
                
            else{
                var sum = (salIntegral) ? ((parseFloat(baseLiquidacion)/30) * 15).toFixed(2) : parseFloat((baseLiquidacion/30) * 20).toFixed(2);
                totalindem = parseFloat(totalindem) + parseFloat(sum);
                days+= (salIntegral) ? 15 : 20;
            }
             year++;
             pendingdays-=360;
        }

        if(pendingdays > 0){
            var sum = (salIntegral) ? ((parseFloat(baseLiquidacion)/30) * (pendingdays*15/360)).toFixed(2) : parseFloat((baseLiquidacion/30) * (pendingdays*20/360)).toFixed(2);
            totalindem = parseFloat(totalindem) + parseFloat(sum);
            totalindem = totalindem.toFixed(2);
            days= (salIntegral) ? (parseFloat(days) + parseFloat(pendingdays*15/360)).toFixed(2) : (parseFloat(days) + parseFloat(pendingdays*20/360)).toFixed(2);
        }

        return {days:days,
            indem: totalindem};
    }
}

function calcLiquidation(baseSalario, baseLiquidacion, totalDays, minSalary, auxTrans, currentDate, startDate, endDate, vacDays, pendingDed,ChkImdespido, salIntegral)
{
    var _cesantias = calculateCesantias(baseLiquidacion, totalDays, minSalary, auxTrans);
    var _icesantias = calculateIcensantias(_cesantias, totalDays); //Cesantías * días trabajados *0.12/360
    var _primaServicios = 0;
    var _vacations = 0;
    if (endDate > currentDate)
    {
        _primaServicios = parseFloat(calculatePrimaservicios(baseLiquidacion, currentDate, startDate, currentDate, minSalary, auxTrans));
        _primaServicios = (parseFloat(_primaServicios) + parseFloat(calculatePrimaservicios(baseLiquidacion, currentDate, currentDate.addDays(1), endDate, minSalary, auxTrans))).toFixed(2);
        _vacations = calcVacations(baseSalario, totalDays, vacDays, currentDate, startDate, endDate, true);
    }
    else
    {
        _primaServicios = (parseFloat(_primaServicios) + parseFloat(calculatePrimaservicios(baseLiquidacion, currentDate, startDate, endDate, minSalary, auxTrans))).toFixed(2);
        _vacations = calcVacations(baseSalario, totalDays, vacDays, currentDate, startDate, endDate, false);

    }

    var _imdespido = (ChkImdespido) ? calcIndemnizacionDespido(baseLiquidacion,totalDays,startDate,currentDate,endDate, salIntegral) : {days:0, indem: 0};

    baseLiquidacion = ((parseFloat(auxTrans) > 0) ? parseFloat(baseLiquidacion) + parseFloat(auxTrans) : parseFloat(baseLiquidacion)).toFixed(2);
    var _totalLiquidation = (parseFloat(_cesantias) + parseFloat(_icesantias) + parseFloat(_primaServicios) + parseFloat(_vacations.vacationPay) + parseFloat(-pendingDed) + parseFloat(_imdespido.indem)).toFixed(2);
    return {
        baseLiquidacion: baseLiquidacion,
        cesantias: String(_cesantias),
        icesantias: String(_icesantias),
        primaServicios: String(_primaServicios),
        vacations: _vacations,
        baseLiq: String(baseLiquidacion),
        imdespido: _imdespido, 
        totalLiquidacion: String(_totalLiquidation)
    }
}

//business logic (client -side) validations

function validateSalariointegral(baseSalary, minsalary, chkSalintegral){
        baseSalary = formatFloat(baseSalary);
        baseSalary = parseFloat(baseSalary).toFixed(2);
        minsalary = formatFloat(minsalary);
        minsalary = parseFloat(minsalary).toFixed(2);
        if (chkSalintegral && (parseFloat(baseSalary) <= parseFloat(minsalary*13).toFixed(2)))
            return false;
        else 
            return true;


}

//On page load ajax functions

function _currentDateTime(){
    var req = new XMLHttpRequest();
    var JsonObjectResponse;
    req.open('GET', 'http://'+document.location.host+'/api/date', false); 
    req.send(null);
    if (req.status == 200)
        JsonObjectResponse = JSON.parse(req.responseText);
    else
        return 0;
    var d = new Date(JsonObjectResponse.scurrentDate_notime);
    return d;

}

function _getMinSalary_AuxTrans(){
    var req = new XMLHttpRequest();
    var JsonObjectResponse;
    req.open('GET', 'http://'+document.location.host+'/api/salariominimo', false); 
    req.send(null);
    if (req.status == 200){
        JsonObjectResponse = JSON.parse(req.responseText);
        return JsonObjectResponse;
    }
    else{
        return 0;
    }
                    
}

//data types formatting functions

function formatMoney(value){
    try{
        return value.replace(".", ",").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
    catch(err){
        return "0,00";
    }
                
}
function formatFloat(value){
    return value.replace(/\./gi, "").replace(/\,/gi, ".");
}

//datetime format and validation functions

function datesvalid(inidate, enddate){
    var regex = new RegExp('-', 'g');
    inidate = (inidate === null) ? "" : new Date(inidate.replace(regex,"/"));
    enddate = (enddate === null) ? "" : new Date(enddate.replace(regex,"/"));
    if (inidate > enddate)
        return false;
    else 
        return true;
}


function calcTimespanDays(startDate, endDate){  
    var Totaldays = 0;

    if ((startDate.getMonth()+1 ==2 && startDate.getDate() > 28))
        startDate = new Date(startDate.getFullYear()+"/"+"/"+(startDate.getMonth()+1)+"/28");
    else if ((startDate.getMonth()+1 !=2 && startDate.getDate() > 30))
        startDate = new Date(startDate.getFullYear()+"/"+"/"+(startDate.getMonth()+1)+"/30");

    if ((endDate.getMonth()+1 ==2 && endDate.getDate() > 28))
        endDate = new Date(endDate.getFullYear()+"/"+"/"+(endDate.getMonth()+1)+"/28");
    else if ((endDate.getMonth()+1 !=2 && endDate.getDate() > 30))
        endDate = new Date(endDate.getFullYear()+"/"+"/"+(endDate.getMonth()+1)+"/30");

                

    if (startDate > endDate)
        return 0;


    if ((endDate.getMonth()+1 == startDate.getMonth()+1) && (endDate.getFullYear() == startDate.getFullYear())){
        if (startDate.getDate() == endDate.getDate())
            return 1;

        Totaldays += daysdiff_twodates(startDate, endDate);
        Totaldays += (endDate.getMonth()+1 == 2 && endDate.getDate() == 28)? 2 : (endDate.getMonth()+1 == 2 && endDate.getDate() == 29) ? 1: 0;
        return (Totaldays); 
    }
    else
    {
        var start_endDate = (startDate.getMonth()+1 == 2) ? new Date(String(startDate.getFullYear())+"/"+String(startDate.getMonth()+1)+"/28") : new Date(startDate.getFullYear()+"/"+(startDate.getMonth()+1)+"/30");
        Totaldays += daysdiff_twodates(startDate, start_endDate);
        Totaldays += (start_endDate.getMonth()+1 == 2 && start_endDate.getDate() == 28)? 2 : 0;


        Totaldays += daysdiff_twodates(new Date(endDate.getFullYear()+"/"+(endDate.getMonth()+1)+"/01"), endDate);
        Totaldays += (endDate.getMonth()+1 == 2 && endDate.getDate() == 28)? 2 : ((endDate.getMonth()+1) == 2 && endDate.getDate() == 29) ? 1: 0;

        var diffmonthly = (diff_monthly(startDate,endDate));

        if ((diffmonthly-2) > 0)
            Totaldays += daysdiff_monthly(diffmonthly-2);

        return (Totaldays);
    }

}

function getTotalYears(start_date, end_date){
    return (start_date.getFullYear() - end_date.getFullYear()) + 1;
}



function _getJsonReport(salary, auxtransporte, oTingMens, liqbase, cesantias, icesantias, prima, vacaciones, liqdays, vacdays, imdespido, imdespidoDays, pendingDed, totalLiquidation){ 
    var jsonrep = [];
    jsonrep.push({Concept: "Salario devengado: ",  Days: "30", Total: "$"+salary, CssClass: false, tableFooter:false, _redTd:false });
    jsonrep.push({Concept: "Auxilio de transporte:",  Days: "30", Total: "$"+auxtransporte, CssClass: false, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Otros ingresos mensuales:",  Days: "30", Total: "$"+oTingMens, CssClass: false, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Base de liquidacíon: ",  Days: "30", Total: "$"+liqbase, CssClass: true, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Cesantías",  Days: liqdays, Total: "$"+cesantias, CssClass:false, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Intereses de cesantías: ",  Days: liqdays, Total: "$"+icesantias, CssClass:false, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Prima de servicios (último periodo): ",  Days: liqdays, Total: "$"+prima, CssClass:false, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Vacaciones: (último perido)",  Days: vacdays, Total: "$"+vacaciones, CssClass:false, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Deducciones Pendientes: ",  Days: "", Total: "$"+pendingDed, CssClass: false, tableFooter:false, _redTd:true  });
    jsonrep.push({Concept: "Indemnización por despido: ",  Days: imdespidoDays, Total: "$"+imdespido, CssClass:true, tableFooter:false, _redTd:false  });
    jsonrep.push({Concept: "Total: ",  Days: "", Total: "$"+totalLiquidation, CssClass:false, tableFooter:true, _redTd:false  });
    var _sitems = [];
    _sitems.push(jsonrep);
    return _sitems;
}




Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

function daysdiff_twodates(startdate, enddate){
    var delta = Math.abs(startdate - enddate) / 1000;
    var days = isNaN(Math.floor(delta / 86400)) ? 0 : (Math.floor(delta / 86400)) + 1;
    delta -= this.days * 86400;
    return days;
}

function diff_monthly(dtstart, dtend){


    var tempDate = dtstart;
    var monthCount = 0;
    while((tempDate.getMonth()+''+tempDate.getFullYear()) != (dtend.getMonth()+''+dtend.getFullYear())) {
        monthCount++;
        tempDate.setMonth(tempDate.getMonth()+1);
    }
    return monthCount+1;

}

function daysdiff_monthly(months){
    return (months*30);
}

//extra functions

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}
