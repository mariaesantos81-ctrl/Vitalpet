// ==========================================
// 1. DADOS INICIAIS (Caso não haja nada no localStorage)
// ==========================================
const doadoresIniciais = [
  { nomeTutor: "Carlos Andrade", whatsapp: "75988887777", cidade: "Alagoinhas - BA", nomePet: "Thor", especie: "Cão", tipoSanguineo: "DEA 1 Negativo (Doador Universal)", raca: "Labrador", porte: "Grande (+25kg)" },
  { nomeTutor: "Ana Paula", whatsapp: "75977776666", cidade: "Salvador - BA", nomePet: "Mimi", especie: "Gato", tipoSanguineo: "Tipo A", raca: "Siamês", porte: "Médio (15-25kg)" }
];

const clinicasIniciais = [
  { nome: "Hospital Veterinário VetVida", email: "contato@vetvida.com", cidade: "Alagoinhas - BA", senha: "vet123" }
];

const comentariosIniciais = [
  { autor: "Carlos Andrade", pet: "Thor (Labrador)", texto: "O Thor doou sangue para um cãozinho acidentado na nossa cidade. Ver o pet recuperado não tem preço!" },
  { autor: "Ana Paula", pet: "Mimi (Siamês)", texto: "Saber que a plataforma é restrita para veterinários nos deu total segurança para cadastrar nossa gatinha." }
];

// ==========================================
// 2. FUNÇÕES DE PERSISTÊNCIA (localStorage)
// ==========================================
function carregarDoadores() {
  const dados = localStorage.getItem('vitalpet_doadores');
  if (dados) return JSON.parse(dados);
  localStorage.setItem('vitalpet_doadores', JSON.stringify(doadoresIniciais));
  return doadoresIniciais;
}

function carregarClinicas() {
  const dados = localStorage.getItem('vitalpet_clinicas');
  if (dados) return JSON.parse(dados);
  localStorage.setItem('vitalpet_clinicas', JSON.stringify(clinicasIniciais));
  return clinicasIniciais;
}

function carregarComentarios() {
  const dados = localStorage.getItem('vitalpet_comentarios');
  if (dados) return JSON.parse(dados);
  localStorage.setItem('vitalpet_comentarios', JSON.stringify(comentariosIniciais));
  return comentariosIniciais;
}

// Inicialização das variáveis globais
let doadores = carregarDoadores();
let clinicasCadastradas = carregarClinicas();
let comentarios = carregarComentarios();

// Elementos da interface
const formDoador = document.getElementById('formDoador');
const formComentario = document.getElementById('formComentario');
const tabelaDoadores = document.getElementById('tabelaDoadores');
const listaComentarios = document.getElementById('listaComentarios');

// ==========================================
// 3. VALIDAÇÕES E UTILITÁRIOS
// ==========================================
function eTextoValido(texto) {
  const limpo = texto.trim();
  if (limpo.length < 3 || !/^[A-Za-zÀ-ÿ\s\-\/]+$/.test(limpo)) return false;
  if (!/[aeiouáéíóúãõâêîôûà]/i.test(limpo)) return false;
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(limpo)) return false;
  return true;
}

function atualizarTiposSanguineos() {
  const especie = document.getElementById('especie').value;
  const selectSangue = document.getElementById('tipoSanguineo');

  selectSangue.innerHTML = '';

  if (especie === 'Cão') {
    selectSangue.innerHTML = `
      <option value="Não sei / A testar na clínica">Não sei / A testar na clínica</option>
      <option value="DEA 1 Negativo (Doador Universal)">DEA 1 Negativo (Doador Universal)</option>
      <option value="DEA 1 Positivo">DEA 1 Positivo</option>
    `;
  } else if (especie === 'Gato') {
    selectSangue.innerHTML = `
      <option value="Não sei / A testar na clínica">Não sei / A testar na clínica</option>
      <option value="Tipo A">Tipo A</option>
      <option value="Tipo B">Tipo B</option>
      <option value="Tipo AB">Tipo AB</option>
    `;
  } else {
    selectSangue.innerHTML = `<option value="Não sei / A testar na clínica">Selecione a espécie primeiro...</option>`;
  }
}

function trocarTela(nomeTela) {
  document.getElementById('telaTutor').classList.remove('active');
  document.getElementById('telaClinica').classList.remove('active');
  
  document.getElementById('btnMenuTutor').classList.remove('active');
  document.getElementById('btnMenuClinica').classList.remove('active');

  if (nomeTela === 'tutor') {
    document.getElementById('telaTutor').classList.add('active');
    document.getElementById('btnMenuTutor').classList.add('active');
  } else {
    document.getElementById('telaClinica').classList.add('active');
    document.getElementById('btnMenuClinica').classList.add('active');
  }
}

function alternarFormVet(opcao) {
  const formLogin = document.getElementById('formLoginVet');
  const formCadastro = document.getElementById('formCadastroVet');
  const btnLogin = document.getElementById('btnTabLogin');
  const btnCadastro = document.getElementById('btnTabCadastro');

  if (opcao === 'login') {
    formLogin.style.display = 'block';
    formCadastro.style.display = 'none';
    btnLogin.classList.add('active');
    btnCadastro.classList.remove('active');
  } else {
    formLogin.style.display = 'none';
    formCadastro.style.display = 'block';
    btnLogin.classList.remove('active');
    btnCadastro.classList.add('active');
  }
}

// ==========================================
// 4. RENDERIZAÇÃO DE INTERFACE
// ==========================================
function renderizarTabela(lista) {
  tabelaDoadores.innerHTML = '';

  if (!lista || lista.length === 0) {
    tabelaDoadores.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 1.5rem; color: #777;">Nenhum pet doador encontrado para este filtro de busca.</td></tr>`;
    return;
  }

  lista.forEach(item => {
    const numWhatsapp = item.whatsapp.replace(/\D/g, '');
    const mensagenWA = encodeURIComponent(`Olá, vi o cadastro do pet ${item.nomePet} (${item.raca}, Tipo: ${item.tipoSanguineo}) no VitalPet e precisamos de doação de sangue para uma emergência.`);
    const linkWhatsapp = `https://wa.me/55${numWhatsapp}?text=${mensagenWA}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.nomePet}</strong></td>
      <td>${item.especie}</td>
      <td><span class="badge-sangue">${item.tipoSanguineo}</span></td>
      <td>${item.raca}</td>
      <td>${item.porte}</td>
      <td>${item.cidade}</td>
      <td>${item.nomeTutor}</td>
      <td>
        <a href="${linkWhatsapp}" target="_blank" class="btn-whatsapp">
          📲 Contatar Doador
        </a>
      </td>
    `;
    tabelaDoadores.appendChild(tr);
  });
}

function renderizarComentarios() {
  listaComentarios.innerHTML = '';

  comentarios.forEach(c => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <p>"${c.texto}"</p>
      <strong>— ${c.autor}, tutor do(a) ${c.pet}</strong>
    `;
    listaComentarios.appendChild(card);
  });
}

// ==========================================
// 5. EVENTOS E SUBMISSÕES
// ==========================================
formComentario.addEventListener('submit', function(e) {
  e.preventDefault();

  const autor = document.getElementById('autorComentario').value;
  const pet = document.getElementById('petComentario').value;
  const texto = document.getElementById('textoComentario').value.trim();

  if (!eTextoValido(autor)) {
    alert('⚠️ Por favor, insira um nome válido para o autor do comentário.');
    return;
  }

  if (texto.length < 5) {
    alert('⚠️ Por favor, escreva um comentário com pelo menos 5 caracteres.');
    return;
  }

  comentarios.unshift({ autor, pet, texto });
  localStorage.setItem('vitalpet_comentarios', JSON.stringify(comentarios));
  
  renderizarComentarios();
  formComentario.reset();
  alert('Obrigado pelo seu comentário! Ele foi publicado no mural.');
});

formDoador.addEventListener('submit', function(e) {
  e.preventDefault();

  const nomeTutor = document.getElementById('nomeTutor').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const cidade = document.getElementById('cidade').value;
  const nomePet = document.getElementById('nomePet').value;
  const especie = document.getElementById('especie').value;
  const tipoSanguineo = document.getElementById('tipoSanguineo').value;
  let raca = document.getElementById('raca').value.trim();
  const porte = document.getElementById('porte').value;

  if (!eTextoValido(nomeTutor)) {
    alert('⚠️ Insira um Nome de Tutor válido.');
    return;
  }

  if (!eTextoValido(cidade)) {
    alert('⚠️ Por favor, insira um nome de Cidade válido.');
    return;
  }

  if (!eTextoValido(nomePet)) {
    alert('⚠️ Insira um Nome de Pet válido.');
    return;
  }

  // Ajuste para raça vazia ou "não sei"
  if (!raca) {
    raca = "SRD / Vira-lata";
  } else if (raca.length >= 3 && !eTextoValido(raca)) {
    alert('⚠️ Insira uma Raça válida ou selecione uma das opções recomendadas.');
    return;
  }

  const apenasNumerosWA = whatsapp.replace(/\D/g, '');
  if (apenasNumerosWA.length < 10 || apenasNumerosWA.length > 11) {
    alert('⚠️ Por favor, insira um número de WhatsApp válido com DDD.');
    return;
  }

  const novoDoador = {
    nomeTutor,
    whatsapp: apenasNumerosWA,
    cidade,
    nomePet,
    especie,
    tipoSanguineo,
    raca,
    porte
  };

  doadores.push(novoDoador);
  localStorage.setItem('vitalpet_doadores', JSON.stringify(doadores));

  renderizarTabela(doadores);
  formDoador.reset();
  alert('🎉 Muito obrigado! O cadastro foi concluído com sucesso.');
});

// Autenticação da Clínica (Corrigida)
function autenticarClinica() {
  const email = document.getElementById('emailClinicaLogin').value.trim().toLowerCase();
  const senha = document.getElementById('senhaClinicaLogin').value.trim();

  // Carrega do localStorage para garantir os dados atualizados
  clinicasCadastradas = carregarClinicas();

  // Busca a clínica cadastrada
  const clinicaEncontrada = clinicasCadastradas.find(c => 
    c.email.toLowerCase() === email && c.senha === senha
  );

  if (clinicaEncontrada) {
    abrirPainelClinica(clinicaEncontrada.nome, clinicaEncontrada.cidade);
  } else {
    alert('⚠️ E-mail ou senha incorretos! Verifique os dados digitados.');
  }
}

// Cadastro de Clínica
function cadastrarClinica() {
  const nome = document.getElementById('nomeClinicaReg').value.trim();
  const email = document.getElementById('emailClinicaReg').value.trim();
  const cidade = document.getElementById('cidadeClinicaReg').value.trim();
  const senha = document.getElementById('senhaClinicaReg').value.trim();

  if (!eTextoValido(nome)) {
    alert('⚠️ Digite um nome válido para a clínica.');
    return;
  }

  if (!eTextoValido(cidade)) {
    alert('⚠️ Digite uma cidade válida para a clínica.');
    return;
  }

  if (senha.length < 4) {
    alert('⚠️ Crie uma senha com pelo menos 4 caracteres.');
    return;
  }

  clinicasCadastradas.push({ nome, email, cidade, senha });
  localStorage.setItem('vitalpet_clinicas', JSON.stringify(clinicasCadastradas));

  alert('Clínica cadastrada com sucesso! Abrindo o painel...');
  abrirPainelClinica(nome, cidade);
}

function abrirPainelClinica(nomeClinica, cidadeRegiao) {
  document.getElementById('loginClinicaBox').style.display = 'none';
  document.getElementById('painelVetExclusivo').style.display = 'block';

  document.getElementById('nomeClinicaLogada').innerText = nomeClinica;
  document.getElementById('infoRegiaoLogada').innerText = `📍 Filtro Ativo da Região: ${cidadeRegiao}`;

  document.getElementById('buscaCidade').value = cidadeRegiao;
  filtrarDoadores();
}

function sairClinica() {
  document.getElementById('emailClinicaLogin').value = '';
  document.getElementById('senhaClinicaLogin').value = '';
  document.getElementById('loginClinicaBox').style.display = 'block';
  document.getElementById('painelVetExclusivo').style.display = 'none';
}

function filtrarDoadores() {
  const cidadeFiltro = document.getElementById('buscaCidade').value.toLowerCase();
  const racaFiltro = document.getElementById('buscaRaca').value.toLowerCase();
  const especieFiltro = document.getElementById('buscaEspecie').value;
  const sangueFiltro = document.getElementById('buscaSangue').value;

  const resultado = doadores.filter(item => {
    const bateCidade = item.cidade.toLowerCase().includes(cidadeFiltro);
    const bateRaca = item.raca.toLowerCase().includes(racaFiltro);
    const bateEspecie = especieFiltro === '' || item.especie === especieFiltro;
    const bateSangue = sangueFiltro === '' || item.tipoSanguineo === sangueFiltro;
    return bateCidade && bateRaca && bateEspecie && bateSangue;
  });

  renderizarTabela(resultado);
}

// ==========================================
// 6. CARREGAMENTO INICIAL DA PÁGINA
// ==========================================
renderizarTabela(doadores);
renderizarComentarios();