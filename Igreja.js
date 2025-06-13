// Função para carregar imagem (foto)
function carregarImagem(event, idDestino) {
  const input = event.target;
  const imgElement = document.getElementById(idDestino);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgElement.src = e.target.result;
      imgElement.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function removerFundoBrancoEConverter(input, destinoID, limiar = 200) {
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        if (avg > limiar) {
          data[i + 3] = 0;
        } else {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const dataURL = canvas.toDataURL("image/png");
      const destino = document.getElementById(destinoID);
      destino.src = dataURL;
      destino.style.display = "block";
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function formatarCPF(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  input.value = value;
}

function formatarMatricula(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 6) value = value.slice(0, 6);
  value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  input.value = value;
}

function formatarDataCompleta(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 8) value = value.slice(0, 8);
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  input.value = value;
}

function gerarCarteira() {
  const nome = document.getElementById("nome").value.toUpperCase();
  const cpf = document.getElementById("cpf").value;
  const matricula = document.getElementById("matricula").value;
  const validade = document.getElementById("validade").value;
  const estadoCivil = document.getElementById("estadoCivil").value.toUpperCase();
  const sexo = document.getElementById("sexo").value.toUpperCase();
  const emissao = document.getElementById("emissao").value;
  const expedidor = document.getElementById("expedidor").value.toUpperCase();
  const cargo = document.getElementById("cargo").value.toUpperCase();
  const nacionalidade = document.getElementById("nacionalidade").value.toUpperCase();
  const pai = document.getElementById("pai")?.value?.toUpperCase?.() || "";
  const mae = document.getElementById("mae")?.value?.toUpperCase?.() || "";
  const dataNascimento = document.getElementById("dataNascimento").value;
  const dataBatismo = document.getElementById("dataBatismo").value;

  if (!nome || !cpf || !matricula) {
    alert("Preencha nome, CPF e matrícula para gerar o QR Code.");
    return;
  }

  document.querySelector(".campo.nome").textContent = nome;
  document.querySelector(".campo.cpf").textContent = cpf;
  document.querySelector(".campo.matricula").textContent = matricula;
  document.querySelector(".campo.validade").textContent = validade;
  document.querySelector(".campo.estadoCivil").textContent = estadoCivil;
  document.querySelector(".campo.sexo").textContent = sexo;
  document.querySelector(".campo.emissao").textContent = emissao;
  document.querySelector(".campo.expedidor").textContent = expedidor;
  document.querySelector(".campo.cargo").textContent = cargo;
  document.querySelector(".campo.nacionalidade").textContent = nacionalidade;
  document.querySelector(".campo.filiacaoPai").textContent = + pai;
  document.querySelector(".campo.filiacaoMae").textContent =  mae;
  document.querySelector(".campo.nascimento").textContent = dataNascimento;
  document.querySelector(".campo.batismo").textContent = dataBatismo;

  const qrTexto = `Nome: ${nome}\nCPF: ${cpf}\nMatrícula: ${matricula}\nValidade: ${validade}\nEstado Civil: ${estadoCivil}\nSexo: ${sexo}\nData de Emissão: ${emissao}\nExpedidor: ${expedidor}\nCargo: ${cargo}\nNacionalidade: ${nacionalidade}\nPai: ${pai}\nMãe: ${mae}\nNascimento: ${dataNascimento}\nBatismo: ${dataBatismo}`;

  const qrCanvas = document.getElementById("qrCanvas");
  const context = qrCanvas.getContext("2d");
  context.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
  new QRious({ element: qrCanvas, size: 120, value: qrTexto });
  qrCanvas.style.display = "block";

  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function exportarPDF() {
  const preview = document.getElementById("carteiraPreview");

  html2canvas(preview, {
    backgroundColor: null,
    useCORS: true,
    scale: 2
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new window.jspdf.jsPDF("landscape", "pt", "a4");
  
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("carteira_membro.pdf");
  });
}

window.onload = function () {
  document.getElementById("modal").style.display = "none";
};
