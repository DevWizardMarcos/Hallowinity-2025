
    // Contador Regressivo
    function updateCountdown() {
      // Data do evento: 25 de outubro de 2025 às 17:00
      const eventDate = new Date('2025-10-25T17:00:00').getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        document.querySelector('.countdown-display').innerHTML = '<p style="color: #ff4500; font-size: 1.5rem;">🎃 O EVENTO COMEÇOU! 🎃</p>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Atualizar contador a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Mostrar/ocultar opções de tamanho da camisa
    document.getElementById('querCamisa').addEventListener('change', function() {
      const camisaDetails = document.getElementById('camisaDetails');
      if (this.checked) {
        camisaDetails.classList.remove('hidden');
      } else {
        camisaDetails.classList.add('hidden');
        // Desmarcar todas as opções de tamanho
        document.querySelectorAll('input[name="tamanho"]').forEach(radio => {
          radio.checked = false;
        });
        // Resetar quantidade
        document.getElementById('quantidadeCamisas').value = '1';
      }
    });

    // Mostrar/ocultar opções do concurso de fantasia
    document.getElementById('participarConcurso').addEventListener('change', function() {
      const concursoDetails = document.getElementById('concursoDetails');
      if (this.checked) {
        concursoDetails.classList.remove('hidden');
      } else {
        concursoDetails.classList.add('hidden');
        // Resetar campos do concurso
        document.getElementById('contest-tipo-main').value = '';
        document.getElementById('contest-idade-main').value = '';
      }
    });

    // Submissão do formulário unificado
    document.getElementById('hallowinityForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Coletando dados básicos do formulário
      const formData = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        acompanhantes: document.getElementById('acompanhantes').value,
        querCamisa: document.getElementById('querCamisa').checked,
        participarConcurso: document.getElementById('participarConcurso').checked
      };

      // Se quer camisa, coletar o tamanho e quantidade
      if (formData.querCamisa) {
        const tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');
        if (!tamanhoSelecionado) {
          alert('Por favor, selecione o tamanho da camisa!');
          return;
        }
        formData.tamanho = tamanhoSelecionado.value;
        formData.quantidadeCamisas = document.getElementById('quantidadeCamisas').value;
      }

      // Se vai participar do concurso, coletar dados do concurso
      if (formData.participarConcurso) {
        const contestTipo = document.getElementById('contest-tipo-main').value;
        const contestIdade = document.getElementById('contest-idade-main').value;
        
        if (!contestTipo || !contestIdade) {
          alert('Por favor, preencha os dados obrigatórios do concurso de fantasia!');
          return;
        }
        
        formData.contestTipo = contestTipo;
        formData.contestIdade = contestIdade;

        // Armazenar no localStorage também para o sistema de votação
        const contestParticipant = {
          id: Date.now(),
          nome: formData.nome,
          telefone: formData.telefone,
          tipo: formData.contestTipo,
          idade: formData.contestIdade,
          votos: 0,
          dataRegistro: new Date().toISOString()
        };

        let contestParticipants = JSON.parse(localStorage.getItem('contestParticipants')) || [];
        const existente = contestParticipants.find(p => 
          p.telefone === formData.telefone || p.nome.toLowerCase() === formData.nome.toLowerCase()
        );

        if (!existente) {
          contestParticipants.push(contestParticipant);
          localStorage.setItem('contestParticipants', JSON.stringify(contestParticipants));
        }
      }
      
      // Função para enviar para WhatsApp
      function enviarParaWhatsApp(tipo) {
        // Construindo mensagem completa para WhatsApp
        let mensagem = `🎃 *INSCRIÇÃO COMPLETA HALLOWINITY 2025* 🎃\n\n`;
        mensagem += `👤 *Nome:* ${formData.nome}\n`;
        mensagem += `📱 *WhatsApp:* ${formData.telefone}\n`;
        mensagem += `👥 *Acompanhantes:* ${formData.acompanhantes}\n\n`;
        
        // Informações da blusa
        if (formData.querCamisa) {
          mensagem += `👕 *BLUSA OFICIAL:* Sim ✅\n`;
          mensagem += `📏 *Tamanho:* ${formData.tamanho}\n`;
          mensagem += `🔢 *Quantidade:* ${formData.quantidadeCamisas}\n\n`;
        } else {
          mensagem += `� *Blusa Oficial:* Não\n\n`;
        }

        // Informações do concurso
        if (formData.participarConcurso) {
          mensagem += `🏆 *CONCURSO DE FANTASIA:* Sim ✅\n`;
          mensagem += `🏫 *Tipo:* ${formData.contestTipo === 'aluno' ? 'Aluno da Infinity School' : 'Visitante'}\n`;
          mensagem += `🎂 *Idade:* ${formData.contestIdade === 'menor' ? 'Menor de idade' : 'Maior de idade'}\n\n`;
        } else {
          mensagem += `🏆 *Concurso de Fantasia:* Não\n\n`;
        }

        // Informações do evento
        mensagem += `🎃 *CONFIRMAÇÃO DE PRESENÇA*\n`;
        mensagem += `📍 *Data:* 25 de Outubro de 2025\n`;
        mensagem += `🕔 *Horário:* 17:00\n`;
        mensagem += `📍 *Local:* Av. do Contorno, 6480 - Savassi, BH\n\n`;
        
        // Tipo de inscrição
        if (formData.querCamisa && formData.participarConcurso) {
          mensagem += `📋 *INSCRIÇÃO COMPLETA* - Evento + Blusa + Concurso`;
        } else if (formData.querCamisa) {
          mensagem += `💰 *VENDAS DE BLUSA* - Interesse em adquirir`;
        } else if (formData.participarConcurso) {
          mensagem += `🏆 *INSCRIÇÃO* - Evento + Concurso de Fantasia`;
        } else {
          mensagem += `📝 *INSCRIÇÃO BÁSICA* - Participação no evento`;
        }
        
        // Codificando mensagem para URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // ⚠️ CONFIGURAÇÃO DOS NÚMEROS DE WHATSAPP
        let numeroWhatsApp;
        
        if (formData.querCamisa) {
          // Números para pessoas que querem a blusa
          const numerosBlusas = [
            '5538984096878', // (38) 8409-6878
            '5517168043330'  // (1) 7168-4330
          ];
          // Alternar entre os dois números para distribuir as mensagens
          const indiceNumero = Math.floor(Math.random() * numerosBlusas.length);
          numeroWhatsApp = numerosBlusas[indiceNumero];
          console.log(`📱 Pessoa quer blusa - Usando número ${indiceNumero + 1}: ${numeroWhatsApp}`);
        } else {
          // Número padrão para inscrições sem blusa
          numeroWhatsApp = '5571992040134'; // ⚠️ NÚMERO DE EXEMPLO - ALTERAR!
          console.log(`📱 Inscrição sem blusa - Usando número padrão: ${numeroWhatsApp}`);
        }
        
        // Validar formato do número brasileiro
        function validarNumero(numero) {
          // Número brasileiro deve ter 13 dígitos: 55 + DDD + 9 + 8 dígitos
          const regex = /^55\d{2}9\d{8}$/;
          return regex.test(numero);
        }
        
        if (!validarNumero(numeroWhatsApp)) {
          console.error('⚠️ ERRO: Número de telefone inválido:', numeroWhatsApp);
          console.error('Formato esperado: 55[DDD]9[8 dígitos] (Ex: 5571992040134)');
          alert('ERRO TÉCNICO: Número de WhatsApp não configurado corretamente.\n\nContacte o desenvolvedor para configurar o número correto.');
          return;
        }
        
        console.log('✅ Número validado:', numeroWhatsApp);
        
        // Função para criar URLs válidas e testadas
        function criarURLsWhatsApp(numero, mensagem) {
          // URLs testadas e validadas
          const urls = {
            web: [
              // URL principal do WhatsApp Web (mais confiável)
              `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`,
              // Fallback universal que funciona em ambos
              `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
            ],
            mobile: [
              // URL do wa.me (funciona em mobile e desktop)
              `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
            ]
          };
          
          // Validar se as URLs estão bem formadas
          urls.web.forEach((url, index) => {
            try {
              new URL(url);
              console.log(`✅ URL Web ${index + 1} válida:`, url.substring(0, 50) + '...');
            } catch (e) {
              console.error(`❌ URL Web ${index + 1} inválida:`, url);
            }
          });
          
          return urls;
        }
        
        const urlsWhatsApp = criarURLsWhatsApp(numeroWhatsApp, mensagem);
        const urlsParaTentar = urlsWhatsApp[tipo] || urlsWhatsApp.mobile;
        
        // Debug: mostrar URLs que serão tentadas
        console.log(`📱 Tentando abrir ${tipo.toUpperCase()}:`, urlsParaTentar.length, 'URLs disponíveis');
        
        // Redirecionamento inteligente com fallback robusto
        function tentarAbrir(urls, indice = 0) {
          if (indice >= urls.length) {
            console.error('❌ Todas as tentativas falharam');
            alert('Não foi possível abrir o WhatsApp automaticamente.\n\nPor favor:\n1. Verifique se tem WhatsApp instalado\n2. Tente copiar o número: ' + numeroWhatsApp.replace(/^55/, '+55 ').replace(/(\d{2})(\d{9})/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2'));
            return;
          }
          
          const urlAtual = urls[indice];
          console.log(`🔄 Tentativa ${indice + 1}/${urls.length}:`, urlAtual.substring(0, 60) + '...');
          
          try {
            const janela = window.open(urlAtual, '_blank');
            
            if (!janela) {
              console.log('🚫 Popup bloqueado, tentando próxima...');
              setTimeout(() => tentarAbrir(urls, indice + 1), 500);
              return;
            }
            
            // Para WhatsApp Web, aguardar carregamento
            if (tipo === 'web' && indice === 0) {
              setTimeout(() => {
                try {
                  if (janela.closed) {
                    console.log('📱 WhatsApp Web fechou, usuário pode ter trocado para app');
                  } else if (janela.location.href === 'about:blank') {
                    console.log('⏳ WhatsApp Web não carregou, tentando fallback...');
                    janela.close();
                    tentarAbrir(urls, indice + 1);
                  } else {
                    console.log('✅ WhatsApp Web carregou com sucesso');
                  }
                } catch (e) {
                  // Erro de CORS indica que o WhatsApp carregou (comportamento esperado)
                  console.log('✅ WhatsApp redirecionou com sucesso');
                }
              }, 2000);
            } else {
              console.log('✅ WhatsApp Mobile aberto com sucesso');
            }
            
          } catch (error) {
            console.error('❌ Erro ao abrir URL:', error);
            setTimeout(() => tentarAbrir(urls, indice + 1), 500);
          }
        }
        
        tentarAbrir(urlsParaTentar);
        
        // Feedback visual
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        const tipoTexto = tipo === 'web' ? 'WhatsApp Web' : 'WhatsApp Mobile';
        
        // Mostrar qual número está sendo usado
        let feedbackTexto;
        if (formData.querCamisa) {
          const numeroFormatado = numeroWhatsApp.replace(/^55/, '+55 ').replace(/(\d{2})(\d{9})/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2');
          feedbackTexto = `✅ Enviando para vendas: ${numeroFormatado}`;
        } else {
          feedbackTexto = `✅ Redirecionando para ${tipoTexto}...`;
        }
        
        submitBtn.textContent = feedbackTexto;
        submitBtn.style.background = '#25D366';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = 'linear-gradient(45deg, #b30000, #e60000)';
        }, 4000); // Aumentei para 4 segundos para dar tempo de ler o número
      }

      // Ocultar botão principal e mostrar opções do WhatsApp
      const submitBtn = document.querySelector('.submit-btn');
      const whatsappOptions = document.querySelector('.whatsapp-options');
      const deviceSuggestion = document.getElementById('device-suggestion');
      
      // Detectar tipo de dispositivo
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        deviceSuggestion.textContent = '💡 Recomendado: WhatsApp Mobile para melhor experiência';
        // Destacar botão mobile
        document.querySelector('[data-type="mobile"]').style.background = 'linear-gradient(45deg, #1fa855, #0a6b5d)';
        document.querySelector('[data-type="mobile"]').style.transform = 'scale(1.05)';
      } else {
        deviceSuggestion.textContent = '💡 Recomendado: WhatsApp Web para computadores';
        // Destacar botão web
        document.querySelector('[data-type="web"]').style.background = 'linear-gradient(45deg, #1fa855, #0a6b5d)';
        document.querySelector('[data-type="web"]').style.transform = 'scale(1.05)';
      }
      
      submitBtn.style.display = 'none';
      whatsappOptions.style.display = 'block';
      
      // Adicionar eventos aos botões do WhatsApp
      document.querySelectorAll('.whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const tipo = this.getAttribute('data-type');
          enviarParaWhatsApp(tipo);
          
          // Restaurar estado original após 3 segundos
          setTimeout(() => {
            submitBtn.style.display = 'block';
            whatsappOptions.style.display = 'none';
          }, 3000);
        });
      });

      // Adicionar evento ao botão voltar
      document.querySelector('.back-btn').addEventListener('click', function() {
        submitBtn.style.display = 'block';
        whatsappOptions.style.display = 'none';
      });
    });

    // Máscara para telefone
    document.getElementById('telefone').addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      this.value = value;
    });

    // Funções do Modal da Blusa
    function openShirtModal() {
      document.getElementById('shirtModal').style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeShirtModal() {
      document.getElementById('shirtModal').style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Fechar modal clicando fora
    window.onclick = function(event) {
      const modal = document.getElementById('shirtModal');
      if (event.target === modal) {
        closeShirtModal();
      }
    }

    /* == Concurso de Fantasia - Lógica JS == */
    (function() {
      const STORAGE_KEY = 'hallowinity_contest_participants_v1';

      function carregarParticipantes() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          console.error('Erro ao carregar participantes:', e);
          return [];
        }
      }

      function salvarParticipantes(list) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
          console.error('Erro ao salvar participantes:', e);
        }
      }

      function atualizarContadores() {
        const participants = carregarParticipantes();
        const totalParticipants = participants.length;
        const totalVotes = participants.reduce((s, p) => s + (p.votes || 0), 0);
        document.getElementById('totalParticipants').textContent = totalParticipants;
        document.getElementById('totalVotes').textContent = totalVotes;
      }

      function criarLista() {
        const participants = carregarParticipantes();
        const listEl = document.getElementById('participantsList');
        listEl.innerHTML = '';

        participants.forEach((p, idx) => {
          const li = document.createElement('li');
          li.className = 'participant-item';

          const meta = document.createElement('div');
          meta.className = 'participant-meta';
          const nameEl = document.createElement('div');
          nameEl.className = 'participant-name';
          nameEl.textContent = p.name;
          const phoneEl = document.createElement('div');
          phoneEl.className = 'participant-phone';
          phoneEl.textContent = p.phone;
          meta.appendChild(nameEl);
          meta.appendChild(phoneEl);

          const actions = document.createElement('div');
          actions.style.display = 'flex';
          actions.style.alignItems = 'center';

          const voteBtn = document.createElement('button');
          voteBtn.className = 'vote-btn';
          voteBtn.textContent = 'Votar';
          voteBtn.title = 'Votar neste participante';
          voteBtn.addEventListener('click', function() {
            votar(idx);
          });

          const votesBadge = document.createElement('span');
          votesBadge.className = 'votes-count';
          votesBadge.textContent = p.votes || 0;

          actions.appendChild(voteBtn);
          actions.appendChild(votesBadge);

          li.appendChild(meta);
          li.appendChild(actions);
          listEl.appendChild(li);
        });
      }

      function cadastrarParticipante(name, phone) {
        if (!name || !phone) return { ok: false, error: 'Nome e telefone obrigatórios' };
        const participants = carregarParticipantes();
        // evitar duplicatas exatas por nome+telefone
        const exists = participants.some(p => p.name.trim().toLowerCase() === name.trim().toLowerCase() && p.phone.replace(/\D/g,'') === phone.replace(/\D/g,''));
        if (exists) return { ok: false, error: 'Participante já cadastrado' };
        const novo = { name: name.trim(), phone: phone.trim(), votes: 0 };
        participants.push(novo);
        salvarParticipantes(participants);
        criarLista();
        atualizarContadores();
        return { ok: true };
      }

      function votar(index) {
        const participants = carregarParticipantes();
        if (!participants[index]) return;
        participants[index].votes = (participants[index].votes || 0) + 1;
        salvarParticipantes(participants);
        criarLista();
        atualizarContadores();
      }

      // Handlers do formulário
      document.getElementById('contestForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('contestNome').value;
        const telefone = document.getElementById('contestTelefone').value;
        const res = cadastrarParticipante(nome, telefone);
        if (!res.ok) {
          alert(res.error);
          return;
        }
        // limpar campos
        document.getElementById('contestNome').value = '';
        document.getElementById('contestTelefone').value = '';
        // feedback simples
        alert('Participante cadastrado com sucesso!');
      });

      // Inicialização
      criarLista();
      atualizarContadores();
    })();

    // ========================================
    // SISTEMA DE ABAS
    // ========================================
    function showTab(tabName) {
      // Esconder todas as abas
      const tabPanels = document.querySelectorAll('.tab-panel');
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Remover classe active de todos os botões
      const tabButtons = document.querySelectorAll('.tab-btn');
      tabButtons.forEach(button => {
        button.classList.remove('active');
      });

      // Mostrar a aba selecionada
      const selectedPanel = document.getElementById(tabName);
      if (selectedPanel) {
        selectedPanel.classList.add('active');
      }

      // Marcar o botão correspondente como ativo
      const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
      if (selectedButton) {
        selectedButton.classList.add('active');
      }
    }

    // ========================================
    // CONCURSO DE FANTASIA
    // ========================================

    // Array para armazenar participantes do concurso
    let contestParticipants = JSON.parse(localStorage.getItem('contestParticipants')) || [];
    let contestVotes = JSON.parse(localStorage.getItem('contestVotes')) || {};

    // Função para cadastrar participante no concurso
    function registerContestant(nome, telefone, tipo, idade, fantasia = '') {
      // Verificar se já existe
      const existente = contestParticipants.find(p => 
        p.telefone === telefone || p.nome.toLowerCase() === nome.toLowerCase()
      );

      if (existente) {
        return { success: false, message: 'Participante já cadastrado!' };
      }

      // Adicionar novo participante
      const participant = {
        id: Date.now(),
        nome: nome,
        telefone: telefone,
        tipo: tipo,
        idade: idade,
        fantasia: fantasia,
        votos: 0,
        dataRegistro: new Date().toISOString()
      };

      contestParticipants.push(participant);
      localStorage.setItem('contestParticipants', JSON.stringify(contestParticipants));
      
      updateContestDisplay();
      return { success: true, message: 'Participante cadastrado com sucesso!' };
    }

    // Função para votar em um participante
    function voteForParticipant(participantId) {
      const voterKey = 'voted_' + Date.now(); // Simula controle de votação
      
      if (localStorage.getItem(voterKey)) {
        alert('Você já votou!');
        return;
      }

      const participant = contestParticipants.find(p => p.id === participantId);
      if (participant) {
        participant.votos++;
        localStorage.setItem('contestParticipants', JSON.stringify(contestParticipants));
        localStorage.setItem(voterKey, 'true');
        updateContestDisplay();
        alert(`Voto computado para ${participant.nome}!`);
      }
    }

    // Função para atualizar a exibição do concurso
    function updateContestDisplay() {
      const participantsList = document.getElementById('participants-list');
      const totalParticipants = document.getElementById('total-participants');
      const totalVotes = document.getElementById('total-votes');

      // Atualizar contadores
      totalParticipants.textContent = contestParticipants.length;
      
      const totalVotesCount = contestParticipants.reduce((sum, p) => sum + p.votos, 0);
      totalVotes.textContent = totalVotesCount;

      // Ordenar por votos (decrescente)
      const sortedParticipants = [...contestParticipants].sort((a, b) => b.votos - a.votos);

      // Limpar lista
      participantsList.innerHTML = '';

      if (sortedParticipants.length === 0) {
        participantsList.innerHTML = `
          <li class="no-participants">
            <p>🎭 Nenhum participante cadastrado ainda</p>
            <p>Seja o primeiro a se inscrever!</p>
          </li>
        `;
        return;
      }

      // Adicionar participantes
      sortedParticipants.forEach((participant, index) => {
        const li = document.createElement('li');
        li.className = 'participant-item';
        
        const positionEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎭';
        const tipoEmoji = participant.tipo === 'aluno' ? '👨‍🎓' : '👥';
        const idadeEmoji = participant.idade === 'menor' ? '🧒' : '🧑‍💼';
        
        li.innerHTML = `
          <div class="participant-meta">
            <div class="participant-name">
              ${positionEmoji} ${participant.nome} ${tipoEmoji} ${idadeEmoji}
            </div>
            <div class="participant-phone">${participant.telefone}</div>
            <div class="participant-details" style="color: #ff7a00; font-size: 0.8rem;">
              ${participant.tipo === 'aluno' ? 'Aluno' : 'Visitante'} • ${participant.idade === 'menor' ? 'Menor de idade' : 'Maior de idade'}
            </div>
            ${participant.fantasia ? `<div class="participant-fantasy" style="color: #ff7a00; font-size: 0.8rem; font-style: italic;">🎭 ${participant.fantasia}</div>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="vote-btn" onclick="voteForParticipant(${participant.id})">
              👍 Votar
            </button>
            <span class="votes-count">${participant.votos} votos</span>
          </div>
        `;
        
        participantsList.appendChild(li);
      });
    }

    // Event listener para o formulário do concurso
    document.addEventListener('DOMContentLoaded', function() {
      const contestForm = document.getElementById('contestForm');
      
      if (contestForm) {
        contestForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const nome = document.getElementById('contest-nome').value.trim();
          const telefone = document.getElementById('contest-telefone').value.trim();
          const tipo = document.getElementById('contest-tipo').value;
          const idade = document.getElementById('contest-idade').value;
          const fantasia = document.getElementById('contest-fantasia').value.trim();

          if (!nome || !telefone || !tipo || !idade) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
          }

          const result = registerContestant(nome, telefone, tipo, idade, fantasia);
          
          if (result.success) {
            // Limpar formulário
            contestForm.reset();
            
            // Enviar para WhatsApp
            const message = `🏆 *CADASTRO CONCURSO DE FANTASIA* 🏆\n\n` +
                           `👤 *Nome:* ${nome}\n` +
                           `📱 *Telefone:* ${telefone}\n` +
                           `🏫 *Tipo:* ${tipo === 'aluno' ? 'Aluno da Infinity School' : 'Visitante'}\n` +
                           `🎂 *Idade:* ${idade === 'menor' ? 'Menor de idade' : 'Maior de idade'}\n` +
                           `${fantasia ? `🎭 *Fantasia:* ${fantasia}\n` : ''}` +
                           `\n🎃 Cadastro realizado para o Concurso de Fantasia Hallowinity 2025!`;
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/5538984096878?text=${encodedMessage}`;
            
            // Confirmar envio
            if (confirm('Cadastro realizado com sucesso! Deseja enviar confirmação por WhatsApp?')) {
              window.open(whatsappURL, '_blank');
            }
          } else {
            alert(result.message);
          }
        });
      }

      // Inicializar display do concurso
      updateContestDisplay();
    });

    // ========================================
    // CARROSSEL DO CONCURSO DE FANTASIA
    // ========================================
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;

    // Função para mostrar slide específico
    function showSlide(index) {
      // Remover active de todos os slides e indicadores
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));
      
      // Adicionar active ao slide e indicador atual
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (indicators[index]) {
        indicators[index].classList.add('active');
      }
      
      currentSlideIndex = index;
    }

    // Função para próximo slide
    function nextSlide() {
      const nextIndex = (currentSlideIndex + 1) % totalSlides;
      showSlide(nextIndex);
    }

    // Função para slide anterior
    function previousSlide() {
      const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      showSlide(prevIndex);
    }

    // Função para ir para slide específico
    function currentSlide(index) {
      showSlide(index - 1); // index começa em 1, array em 0
    }

    // Auto-play do carrossel (opcional)
    function startCarouselAutoPlay() {
      setInterval(nextSlide, 5000); // Muda slide a cada 5 segundos
    }

    // Inicializar carrossel quando o DOM estiver carregado
    document.addEventListener('DOMContentLoaded', function() {
      // Inicializar o primeiro slide
      if (slides.length > 0) {
        showSlide(0);
        // Iniciar auto-play após 3 segundos
        setTimeout(startCarouselAutoPlay, 3000);
      }
    });

    // ========================================
    // MODAL DA GALERIA DE FOTOS
    // ========================================

    // Array com informações das imagens
    const galleryImages = [
      {
        src: 'concurso1.PNG',
        title: '🏆 Vencedores do Concurso 2024',
        description: 'Os grandes campeões do concurso de fantasia do ano passado com suas incríveis criações que conquistaram o público e os jurados.'
      },
      {
        src: 'concurso2.PNG',
        title: '🎭 Fantasias Mais Criativas',
        description: 'Uma seleção das fantasias mais originais e criativas que participaram do concurso, mostrando a diversidade e talento dos participantes.'
      },
      {
        src: 'concurso3.PNG',
        title: '🎃 Melhores Momentos do Evento',
        description: 'Registros dos momentos mais marcantes da noite, com toda a atmosfera mágica e assombrada que tornou o evento inesquecível.'
      }
    ];

    let currentImageIndex = 0;

    // Função para abrir modal da galeria
    function openGalleryModal() {
      document.getElementById('galleryModal').style.display = 'block';
      document.body.style.overflow = 'hidden'; // Previne scroll da página
    }

    // Função para fechar modal da galeria
    function closeGalleryModal() {
      document.getElementById('galleryModal').style.display = 'none';
      document.body.style.overflow = 'auto'; // Restaura scroll da página
    }

    // Função para abrir modal de imagem individual
    function openImageModal(imageIndex) {
      currentImageIndex = imageIndex;
      const imageData = galleryImages[imageIndex];
      
      document.getElementById('modalImage').src = imageData.src;
      document.getElementById('modalImage').alt = imageData.title;
      document.getElementById('imageTitle').textContent = imageData.title;
      document.getElementById('imageDescription').textContent = imageData.description;
      
      document.getElementById('imageModal').style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Fechar galeria se estiver aberta
      closeGalleryModal();
    }

    // Função para fechar modal de imagem
    function closeImageModal() {
      document.getElementById('imageModal').style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Função para imagem anterior
    function previousImage() {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      const imageData = galleryImages[currentImageIndex];
      
      document.getElementById('modalImage').src = imageData.src;
      document.getElementById('modalImage').alt = imageData.title;
      document.getElementById('imageTitle').textContent = imageData.title;
      document.getElementById('imageDescription').textContent = imageData.description;
    }

    // Função para próxima imagem
    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      const imageData = galleryImages[currentImageIndex];
      
      document.getElementById('modalImage').src = imageData.src;
      document.getElementById('modalImage').alt = imageData.title;
      document.getElementById('imageTitle').textContent = imageData.title;
      document.getElementById('imageDescription').textContent = imageData.description;
    }

    // Event listeners para fechar modais
    document.addEventListener('DOMContentLoaded', function() {
      // Fechar modais ao clicar fora do conteúdo
      window.addEventListener('click', function(event) {
        const galleryModal = document.getElementById('galleryModal');
        const imageModal = document.getElementById('imageModal');
        
        if (event.target === galleryModal) {
          closeGalleryModal();
        }
        if (event.target === imageModal) {
          closeImageModal();
        }
      });

      // Navegação por teclado
      document.addEventListener('keydown', function(event) {
        const imageModal = document.getElementById('imageModal');
        
        if (imageModal.style.display === 'block') {
          switch(event.key) {
            case 'Escape':
              closeImageModal();
              break;
            case 'ArrowLeft':
              previousImage();
              break;
            case 'ArrowRight':
              nextImage();
              break;
          }
        }
        
        if (document.getElementById('galleryModal').style.display === 'block' && event.key === 'Escape') {
          closeGalleryModal();
        }
      });
    });
