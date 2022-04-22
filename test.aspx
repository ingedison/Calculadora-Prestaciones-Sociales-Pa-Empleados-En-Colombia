<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="test.aspx.cs" Inherits="CalculadoraLPS_Web.test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:TextBox ID="TextBox1" CssClass="money" runat="server"></asp:TextBox>
    </div>
    </form>
    <script src="App_Themes/SiteDefault/js/jquery-3.3.1.min.js"></script>
    <script src="App_Themes/SiteDefault/js/jquery.mask.min.js"></script>
    <script type"text/javascript">
        $(document).ready(function () {
            $('.money').mask('000.000.000.000.000,00', { reverse: true });
        });
    </script>
</body>
</html>
