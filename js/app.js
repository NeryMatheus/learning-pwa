// Carregamento AJAX
let ajax = new XMLHttpRequest();
ajax.open('GET', './dados.json', true);
ajax.send();

ajax.onreadystatechange = function() {
    //Especificar o container que recebe o conteúdo gerado nesse arquivo
    let content = document.getElementById('content');

    if (ajax.readyState === 4 && ajax.status === 200) {
        let data = JSON.parse(ajax.responseText);

        if(data.length === 0) {
            content.innerHTML = '<div class="alert alert-warning" role="alert"><strong>Atenção!</strong> Não há brinquedos cadastrados.</div>';
            return;
        } else {
            let html = '';

            for (let i = 0; i < data.length; i++) {
                html += '<div class="row"><div class="col-12"><h2> <span></span> '+data[i]['categoria']+' </h2></div></div>';

                if(data[i]['brinquedos'].length === 0) {
                    html += '<div class="alert alert-warning" role="alert"><strong>Atenção!</strong> Não há brinquedos cadastrados para esta categoria.</div>';
                } else {
                    html += '<div class="row">';
                    for (let j = 0; j < data[i].brinquedos.length; j++) {
                        html += card_brinquedo(data[i].brinquedos[j].nome, data[i].brinquedos[j].imagem, data[i].brinquedos[j].whatsapp, data[i].brinquedos[j].valor);
                    }
                    html += '</div>';
                }
            }
    
            content.innerHTML = html;
            cache_dinamico(data);
        }
    }
}

// Template do card do brinquedo

var card_brinquedo = function(nome, imagem, whatsapp, valor) {
    return '<div class="col-lg-6">'+
                '<div class="card">'+
                    '<img src="'+imagem+'" class="card-img-top" alt="'+nome+'">'+
                    '<div class="card-body">'+
                        '<h5 class="card-title">'+nome+'</h5>'+
                        '<p class="card-text"><strong>Valor:</strong> '+valor+' </p>'+
                        '<div class="d-grid gap-2">'+
                            '<a href="https://wa.me/55'+whatsapp+'?text=Ol%C3%A1%2C+gostaria+de+informa%C3%A7%C3%B5es+sobre+o+brinquedo%3A+'+nome+'" target="_blank"class="btn btn-info">Contato do proprietário</a>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
}

// Construção do cache dinâmico

var cache_dinamico = function(data_json) {
    if('caches' in window) {
        console.log('Deletando cache dinâmico');
        
        cache.delete('brinquedo-app-dinamico').then(function() {
            if (data_json.length > 0) {
                var files = ['dados.json'];

                for (let i = 0; i < data.length; i++) {

                    for (let j = 0; j < data[i].brinquedos.length; j++) {
                        if(files.indexOf(data[i].brinquedos[j].imagem) === -1) {
                            files.push(data[i].brinquedos[j].imagem);
                        }
                    }

                }
            }

            caches.open('brinquedo-app-dinamico').then(function(cache) {
                return cache.addAll(files).then(function() {
                    console.log('Cache dinâmico atualizado');
                });
            });
        });
    }
};

// Botão de Instalação

let disparoInstalacao = null;
const btInstall = document.getElementById('btInstall');

let inicializarInstalacao = function() {
    btInstall.removeAttribute('hidden');
    btInstall.addEventListener('click', function() {

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then(function(choice) {
            if(choice.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação');
            } else {
                console.log('Usuário não aceitou a instalação');
            }
        });

    });
};
window.addEventListener('beforeinstallprompt', gravarDisparoInstalacao);

function gravarDisparoInstalacao(evt) {
    console.log('Disparo de instalação capturado');
    disparoInstalacao = evt;
}