<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/Master.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CalculadoraLPS_Web.Default" %>

    <asp:Content ID="HeadContent" ContentPlaceHolderID="head" runat="server">
        <title></title>

    </asp:Content>

    <asp:Content ID="BodyContent" ContentPlaceHolderID="_BodyContent" runat="server">

        
<div id="app">
    <v-app id="inspire">
        <v-content>
            <template>
                <div class="corner-ribbon top-right sticky blue"> <span>Beta</span></div>
                <v-toolbar style="background-color:#ffffff">
                    <!--<v-toolbar-side-icon></v-toolbar-side-icon>-->
                    <img src="http://192.168.17.135/resources/assets/logo-nexarte-mini.png?1648b" />
                    <v-toolbar-title style="color:#006573">Calculadora de liquidación laboral</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <!--<v-btn icon>
                        <v-icon style="color:#006573">more_vert</v-icon>
                    </v-btn>-->
                </v-toolbar>
            </template>

            <template>
                <v-stepper v-model="e1" style="box-shadow: 0 0px 0px 0px rgba(0,0,0,.2),0 0px 0 rgba(0,0,0,.14),0 0px 0px 0 rgba(0,0,0,.12);">
                    <v-stepper-header>
                        <v-stepper-step step="1" :complete="e1 > 1" editable>Ingreso de datos de nómina</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step step="2" :complete="e1 > 2" >Calculo de liquidación</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step step="3">Descargar reporte PDF</v-stepper-step>
                        <div style="width: 100%; background: url(https://www.nexarte.com/templates/aura/images/hexagon.png) rgb(0, 173, 176);height: 5px;"></div>
                    </v-stepper-header>
                    <v-stepper-items>
                        <v-stepper-content step="1">
                              <!--section 1 -->
                            <v-form ref="form" v-model="valid" lazy-validation>        
                             <v-container fluid> 
                               <div class="section group">
                                     <div class="col span_1_of_2">      
                                        <v-layout row>
                                          <v-flex xs12 style="position:relative;">
                                                
                                              
                                              <div class="text-xs-center d-flex align-center" style="position:absolute; right:12px; color:#BDBDBD; top:20px; width:10px; height:10px;cursor: pointer; z-index:2">
                                                    <v-tooltip bottom>
                                                      <v-icon slot="activator" style="color:#BDBDBD;">help</v-icon>
                                                      <span>Salario base: <br /> Ejemplo: 1.500.000,52 <br /> Parte entera: 1.500.000 <br /> parte decimal: 52</span>
                                                    </v-tooltip>
                                                </div>
                                                    <v-text-field 
                                                      name="iSal_Base"
                                                         v-model="vSal_Base"
                                                         :rules="iSal_BaseRules"
                                                         :counter="15"
                                                         label="Salario base de calculo"
                                                         prepend-icon="monetization_on"
                                                         id="Sal_Base"
                                                         v-money="money"
                                                        required
                                                    ></v-text-field>
                                          </v-flex>
                                        </v-layout>
                                    </div>
                                    <div class="col span_1_of_2">

                                <v-layout row class="row_responsive">
             <v-flex xs4>
                 <v-subheader style="padding-left:0px; padding-top:15px">Tipo de contrato:</v-subheader>
             </v-flex>
                                    <v-flex xs8>
                                    <v-radio-group v-on:change="radChange" v-model="contracType_radio" row>
                                        <v-radio :label="`Término Indefinido`" :value="1" class="rad_responsive"></v-radio>
                                        <v-radio :label="`Término Fijo`" :value="2"></v-radio>
                                    </v-radio-group>
                                      </v-flex>

                                </v-layout>
                            </div>
                        </div>
                                </v-container>
                                                                         

                            <!--section 2 -->

                                                        <v-container fluid> 
                               <div class="section group">
                                     <div class="col span_1_of_2">      
                                        <v-layout row>
                                         <v-flex xs3>
                                          <v-subheader style=" padding-top:15px; padding-left:0px">Causa Liquidación:</v-subheader>
                                          </v-flex>
                                            <v-flex xs9>
                                                <v-select
                                                  v-model="select"
                                                  :items="items"
                                                  label="Seleccionar"
                                                  single-line
                                                  :rules="[v => !!v || 'Seleccione causa de liquidación']"
                                                  required
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                    </div>
                                    <div class="col span_1_of_2">

                                <v-layout row>
                                    <v-flex xs6>
    <v-checkbox :label="`Salario integral`" v-model="ChkSalintegral" class="chk_responsive"></v-checkbox> 

                                      </v-flex>

                                        <v-flex xs6>
    <v-checkbox :label="`Indemización por despido`" v-model="ChkImdespido" class="chk_responsive"></v-checkbox>

                                      </v-flex>

                                </v-layout>
                            </div>
                        </div>
                                </v-container>

                            <!--seccion 3 -->
                            <v-container fluid> 
                               <div class="section group">
                                     <div class="col span_1_of_2">      
                                        <v-layout row>
                                          <v-flex xs12>
                                                      <v-menu
                                                        ref="menu1"
                                                        lazy
                                                        :close-on-content-click="false"
                                                        v-model="menu1"
                                                        transition="scale-transition"
                                                        offset-y
                                                        full-width
                                                        :nudge-right="40"
                                                        min-width="290px"
                                                        :return-value.sync="date_ini"
                                                      >
                                                        <v-text-field
                                                          slot="activator"
                                                          label="Fecha de contratación"
                                                          v-model="date_ini"
                                                          prepend-icon="event"
                                                         :rules="date_Rules"
                                                         required
                                                        ></v-text-field>
                                                        <v-date-picker v-model="date_ini" scrollable>
                                                          <v-spacer></v-spacer>
                                                          <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                                                          <v-btn flat color="primary" @click="calcDays($refs,'start')">Listo</v-btn>
                                                        </v-date-picker>
                                                      </v-menu>
                                          </v-flex>
                                        </v-layout>
                                    </div>
                                    <div class="col span_1_of_2">

                                <v-layout row>
                                      <v-flex xs6>
                                                  <v-menu
                                                    ref="menu3"
                                                    lazy
                                                    :close-on-content-click="false"
                                                    v-model="menu3"
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    :nudge-right="40"
                                                    min-width="290px"
                                                    :return-value.sync="date_ter"
                                                  >
                                                    <v-text-field
                                                      slot="activator"
                                                      label="Fecha de terminación"
                                                      v-model="date_ter"
                                                      prepend-icon="event"
                                                     :rules="date_Rules"
                                                      :required="reqTerdate"
                                                      :disabled="dateTermdis"
                                                    ></v-text-field>
                                                    <v-date-picker v-model="date_ter" scrollable :readonly="dateTermdis" persistent-hint>
                                                      <v-spacer></v-spacer>
                                                      <v-btn flat color="primary" @click="menu3 = false">Cancelar</v-btn>
                                                      <v-btn flat color="primary" @click="nocalcDays($refs)" :disabled="dateTermdis">Listo</v-btn>
                                                    </v-date-picker>
                                                  </v-menu>

                                  </v-flex>

                                 <v-flex xs6>
                                                  <v-menu
                                                    ref="menu2"
                                                    lazy
                                                    :close-on-content-click="false"
                                                    v-model="menu2"
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    :nudge-right="40"
                                                    min-width="290px"
                                                    :return-value.sync="date_fin"
                                                  >
                                                    <v-text-field
                                                      slot="activator"
                                                      label="Fecha de liquidación"
                                                      v-model="date_fin"
                                                      prepend-icon="event"
                                                     :rules="date_Rules"
                                                      required
                                                    ></v-text-field>
                                                    <v-date-picker v-model="date_fin" scrollable>
                                                      <v-spacer></v-spacer>
                                                      <v-btn flat color="primary" @click="menu2 = false">Cancelar</v-btn>
                                                      <v-btn flat color="primary" @click="calcDays($refs,'end')">Listo</v-btn>
                                                    </v-date-picker>
                                                  </v-menu>

                                  </v-flex>

                                </v-layout>
                            </div>
                        </div>
                                </v-container>

<!--seccion 4 -->
                            <v-container fluid> 
                               <div class="section group">
                                     <div class="col span_1_of_2">      
                                        <v-layout row>
                                          <v-flex xs12>
                                            <v-text-field 
                                              name="iTextB_OIMS"
                                              v-model="pendingDeduc" 
                                                prepend-icon="monetization_on"
                                              label="Deducciones pendientes"
                                              id="TextB_OIMS"
                                                v-money="money"
                                             required
                                            ></v-text-field>
                                          </v-flex>
                                        </v-layout>
                                    </div>
                                    <div class="col span_1_of_2">

                                <v-layout row>
                                 <v-flex xs12>
                                    <v-text-field 
                                      name="iTextB_DP"
                                        v-model="OingMens" 
                                        prepend-icon="monetization_on"
                                      label="Otros ingresos mensaules"
                                      id="TextB_DP"
                                        v-money="money"
                                        required
                                    ></v-text-field>
                                  </v-flex>

                                </v-layout>
                            </div>
                        </div>
                                </v-container>


<!--seccion 5 -->

                            <v-container fluid> 
                               <div class="section group">
                                     <div class="col span_1_of_2">      
                                        <v-layout row>
                                          <v-flex xs7>
                                            <v-text-field 
                                              name="iTextB_vca"
                                              v-model="vTextB_vca"
                                                prepend-icon="monetization_on"
                                              label="Valor cesantias anticipadas"
                                              id="TextB_vca"
                                              v-money="money"
                                            ></v-text-field>
                                          </v-flex>
                                    <v-flex xs5 style="padding-left:2%;">
                                    <v-text-field 
                                      name="iTextB_Tdays"
                                        prepend-icon="directions_car"
                                      label="Auxilio de transporte"
                                      v-model="aux_trans"
                                      id="TextB_AuxTrans"
                                        v-money="money"
                                      required
                                        disabled
                                    ></v-text-field>
                                  </v-flex>
                                        </v-layout>
                                    </div>
                                    <div class="col span_1_of_2">

                                <v-layout row>

                                 <v-flex xs8 style="">
                                    <v-text-field 
                                      name="iTextB_Tdays"
                                        prepend-icon="date_range"
                                      label="Dias pend. Vacaciones"
                                        v-money="days"
                                        v-model="vac_days"
                                    ></v-text-field>
                                  </v-flex>

                                 <v-flex xs4 style="padding-left:2%;">
                                    <v-text-field 
                                      name="iTextB_Tdays"
                                        prepend-icon="date_range"
                                      label="Total dias a liquidar"
                                      v-model="t_days"
                                      id="TextB_Tdays"
                                        readonly
                                    ></v-text-field>
                                  </v-flex>

                                </v-layout>
                            </div>
                        </div>
                                </v-container>

                            <!--end secciones -->

                        <v-btn color="primary" :disabled="!valid" :loading="loading" @click="doCalc(1)" >Calcular</v-btn>
                        <v-btn flat>Limpiar</v-btn>
  </v-form>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                      
                        <div style=" width: 50%; height: 40px; background: url('https://www.nexarte.com/templates/aura/images/hexagon.png') scroll 0% 0%;border-right: 30px white solid;border-bottom: 50px solid transparent;border-top-left-radius: 5px;"> 
                            <h1 style="color: white;padding-top: 5px;padding-left: 20px;">Liquidación</h1>
                        </div>
                        <v-container fluid> 
                            <datatable   v-for="_itm in dtitems" v-bind:_item="_itm" v-bind:headers="headers"></datatable>
                            <br />
                              <v-btn color="primary" :loading="loading"  @click="postDatapdf(2)">
                                        <v-icon left dark>cloud_upload</v-icon> CARGAR Y OBTENER PDF
                              </v-btn>
                      </v-container>

                    </v-stepper-content>
                    <v-stepper-content step="3">

                              <div v-if="!show"> 
                                             <div class="LoaderContent"> <div class="loadnigMsg"> Estamos procesando la solicitud, por favor espere un momento ... </div> <br/> <figure> <div class="dot white"></div> <div class="dot"></div> <div class="dot"></div> <div class="dot"></div> <div class="dot"></div> </figure> </div>                                  
                              </div>

                              <div v-if="show"> 
                                  <div class="loadnigMsg"> 
                                  <a v-bind:href="reportLink" download> 
                                      <v-btn color="primary" :loading="loading" @click="downpdf()">
                                                <v-icon left dark>cloud_download</v-icon> DESCARGAR PDF
                                      </v-btn>
                                  </a>
                                  </div>
                              </div>

                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </template>

       <template>
              <v-layout row justify-center>
                
                <v-dialog v-model="dialog" max-width="290">
                  <v-card>
                    <v-card-title class="headline">¡No podemos conectarnos con el servidor en este momento!</v-card-title>
                    <v-card-text>Es posible que la aplicación no funcione de manera correcta, verifica tu conexión a internet e intenta cargar nuevamente la página. si el problema persiste por favor contacta al administrador del sitio.</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Aceptar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </template>

    </v-content>
</v-app>

</div>
        <script src="App_Themes/SiteDefault/js/polyfill.min.js"></script>
        <script src="App_Themes/SiteDefault/js/vuedist.min.js"></script>
        <script src="App_Themes/SiteDefault/js/vuetify.min.js"></script>
        <script src="App_Themes/SiteDefault/js/v-money.js"></script>
        <script src="App_Themes/SiteDefault/js/axios.min.js"></script>
        
         <script src="App_Themes/SiteDefault/js/script.js"></script>

    </asp:Content>

