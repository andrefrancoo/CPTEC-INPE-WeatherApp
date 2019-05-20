    if(localStorage.getItem("localizacoes") != undefined){
        var localizacoes = JSON.parse(localStorage.getItem("localizacoes"));
        setRecentes();
    }else{
        var localizacoes = [];
    }

    var condicoesText = {
        'ec':'Encoberto com Chuvas Isoladas',
        'ci':'Chuvas Isoladas',
        'c':'Chuva',
        'in':'Instável',
        'pp':'Poss. de Pancadas de Chuva',
        'cm':'Chuva pela Manhã',
        'cn':'Chuva a Noite',
        'pt':'Pancadas de Chuva a Tarde',
        'pm':'Pancadas de Chuva pela Manhã',
        'np':'Nublado e Pancadas de Chuva',
        'pc':'Pancadas de Chuva',
        'pn':'Parcialmente Nublado',
        'cv':'Chuvisco',
        'ch':'Chuvoso',
        't':'Tempestade',
        'ps':'Predomínio de Sol',
        'e':'Encoberto',
        'n':'Nublado',
        'cl':'Céu Claro',
        'nv':'Nevoeiro',
        'g':'Geada',
        'ne':'Neve',
        'nd':'Não Definido',
        'pnt':'Pancadas de Chuva a Noite',
        'psc':'Possibilidade de Chuva',
        'pcm':'Possibilidade de Chuva pela Manhã',
        'pct':'Possibilidade de Chuva a Tarde',
        'pcn':'Possibilidade de Chuva a Noite',
        'npt':'Nublado com Pancadas a Tarde',
        'npn':'Nublado com Pancadas a Noite',
        'ncn':'Nublado com Poss. de Chuva a Noite',
        'nct':'Nublado com Poss. de Chuva a Tarde',
        'ncm':'Nubl. c/ Poss. de Chuva pela Manhã',
        'npm':'Nublado com Pancadas pela Manhã',
        'npp':'Nublado com Possibilidade de Chuva',
        'vn':'Variação de Nebulosidade',
        'ct':'Chuva a Tarde',
        'ppn':'Poss. de Panc. de Chuva a Noite',
        'ppt':'Poss. de Panc. de Chuva a Tarde',
        'ppm':'Poss. de Panc. de Chuva pela Manhã'
    };

    var condicoesIcons = {
        'ec':'day-hail',
        'ci':'day-sprinkle',
        'c':'day-rain',
        'in':'day-cloudy-windy',
        'pp':'day-rain-wind',
        'cm':'day-hail',
        'cn':'night-alt-rain',
        'pt':'night-showers',
        'pm':'day-sleet',
        'np':'night-alt-rain-wind',
        'pc':'day-sleet',
        'pn':'day-sunny-overcast',
        'cv':'day-sleet',
        'ch':'day-alt-rain',
        't':'day-thunderstorm',
        'ps':'hot',
        'e':'day-cloudy-high',
        'n':'sunny-overcast',
        'cl':'day-light-wind',
        'nv':'day-fog',
        'g':'day-snow-wind',
        'ne':'ay-snow',
        'nd':'na',
        'pnt':'night-alt-rain',
        'psc':'day-rain-mix',
        'pcm':'day-rain-mix',
        'pct':'day-rain-mix',
        'pcn':'night-alt-rain',
        'npt':'day-sleet',
        'npn':'night-sleet',
        'ncn':'night-alt-rain',
        'nct':'day-sleet',
        'ncm':'day-sleet',
        'npm':'day-sleet',
        'npp':'day-sleet',
        'vn':'day-cloudy-gusts',
        'ct':'night-alt-rain',
        'ppn':'night-alt-rain',
        'ppt':'day-rain-mix',
        'ppm':'day-rain-mix'
    };

    function limparHistorico(){
        $("#recentes ul").html("");
        localizacoes = [];
        localStorage.clear();
        setRecentes();
    }

    function setRecentes(){
        $("#recentes ul").html("");
        $(localizacoes).each(function(index, value){
            $("#recentes ul").append(`<li>${value}</li>`);
        });

        if($("#recentes ul li").length > 0){
            $("#limparHistorico").show();
        }else{
            $("#limparHistorico").hide();
        }
    }

    var diaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    function urlAmigavel(palavra){

        especiais = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
        normais = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
        
        amigavel = '';

        for(i = 0; i < palavra.length; i++) {
            if (especiais.search(palavra.substr(i,1))>=0) {
                amigavel += normais.substr(especiais.search(palavra.substr(i,1)),1);
            }else{
                amigavel += palavra.substr(i,1);
            }
        }
        return amigavel;
    }

    function getLocation(){
        if($("#busca-localizacao").val().length > 1){

            var keyvalue = $("#busca-localizacao").val();
            var xhttp;
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //cities = [];
                    selectCity(this , keyvalue);
                }
            };
            xhttp.open("GET", `http://servicos.cptec.inpe.br/XML/listaCidades?city=${encodeURI(urlAmigavel(keyvalue))}`, true);
            xhttp.send();
        }
    }

    function selectCity(response , key) {
        var cities = [];
        var nome, id, i, xml , key;
        xml = response.responseXML;
        nome = xml.getElementsByTagName("nome");
        id = xml.getElementsByTagName("id");

        //console.log(key);

        var counter = 0;
            
        for (i = 0; i < nome.length; i++) {
            var value = nome[i].childNodes[0].nodeValue.trim();
            var locationValue = id[i].childNodes[0].nodeValue.trim();
            var pattern = value.substring(0 , key.length);

            //console.log(urlAmigavel(key.toUpperCase())+" - "+urlAmigavel(pattern.toUpperCase()));

            if(urlAmigavel(key.toUpperCase()) == urlAmigavel(pattern.toUpperCase())){
                cities.push({'location':locationValue, 'label':value,'value':value});
                counter++;
            }
        }

        if(cities.length > 0){
            $( "#busca-localizacao" ).autocomplete({
                source: cities,
                select: function (e, i) {
                    getPrevisao(i.item.location);
                }
            });
        }
    }
    
    function getPrevisao(city){

        var keyvalue = city;
        var xhttp;
        xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //cities = [];
                setPrevisaoHTML(this, city);
            }
        };
        xhttp.open("GET", `http://servicos.cptec.inpe.br/XML/cidade/7dias/${city}/previsao.xml`, true);
        xhttp.send();
    }

    j = 0;

    function setPrevisaoHTML(response, cityCode){

        j++;    

        var xml = response.responseXML;
        var cidade = $(xml).find("nome").text(); 
        var estado = $(xml).find("uf").text();

        localizacoes.push(`<a href='#' onClick='getPrevisao(${cityCode})'>${cidade}, <strong>${estado}</strong></a>`);
        
        var localizacoesAux = localizacoes.filter(function(x, i) {
            return localizacoes.indexOf(x) == i;
        });

        localizacoes = localizacoesAux;
        localStorage.setItem("localizacoes", JSON.stringify(localizacoes));

        localStorage.setItem("cityCode", cityCode);

        setRecentes();

        $("#resultado").html(`<h1 class="heading text-center">${cidade}, <strong>${estado}</strong></h1>
            <div class='owl-${j} owl-carousel owl-theme'></div>`);

        $(xml).find("previsao").each(function(){

            var resultado;

            dia = new Date($(this).find("dia").text().replace('-',','));
            //console.log($(this).find("dia").text());

            resultado = `<h2>${diaSemana[dia.getDay()].slice(0, 3)}</h2>
                <h3>${dia.getDate()}/${(dia.getMonth()+1)}</h3>
                <i class="wi wi-${condicoesIcons[$(this).find("tempo").text()]} tempo"></i>
                ${condicoesText[$(this).find("tempo").text()]}
                <div class='previsao-icons row'>
                    <div class='col-md-4 col-sm-4 col-xs-4' data-toggle="tooltip" data-placement="top" title="Máxima"><i class="fa fa-arrow-down min" aria-hidden="true"></i>${$(this).find("minima").text()}</div>
                    <div class='col-md-4 col-sm-4 col-xs-4' data-toggle="tooltip" data-placement="top" title="Mínima"><i class="fa fa-arrow-up max" aria-hidden="true"></i>${$(this).find("maxima").text()}</div>
                    <div class='col-md-4 col-sm-4 col-xs-4' data-toggle="tooltip" data-placement="top" title="UV"><i class="fa fa-sun-o uv" aria-hidden="true"></i>${$(this).find("iuv").text()}</div>
                </div>`;

            $("#resultado .owl-"+j).append(`<section class='item text-center'>${resultado}</section>`);
        }); 

        $('.owl-'+j).owlCarousel({
            loop:false,
            margin:10,
            nav:false,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                 450:{
                    items:2,
                    nav:false
                },
                1000:{
                    items:3,
                    nav:false,
                    loop:false
                }
            }
        });

        $('[data-toggle="tooltip"]').tooltip();

        //console.log(localizacoes);

    }