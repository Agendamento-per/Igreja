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

function gerarCarteira() {
  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const matricula = document.getElementById("matricula").value;
  const validade = document.getElementById("validade").value;
  const estadoCivil = document.getElementById("estadoCivil").value;
  const sexo = document.getElementById("sexo").value;
  const emissao = document.getElementById("emissao").value;
  const expedidor = document.getElementById("expedidor").value;
  const cargo = document.getElementById("cargo").value;
  const nacionalidade = document.getElementById("nacionalidade").value;

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

  const qrCanvas = document.getElementById("qrCanvas");
  if (nome && cpf && matricula) {
    new QRious({
      element: qrCanvas,
      size: 120,
      value: `Nome: ${nome}\nCPF: ${cpf}\nMatrícula: ${matricula}`
    });
    qrCanvas.style.display = "block";
  } else {
    qrCanvas.style.display = "none";
  }

  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function exportarPDF() {
  const modal = document.getElementById("carteiraPreview");
  html2canvas(modal).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF({ orientation: "landscape" });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("carteira_membro.pdf");
  });
}

window.onload = function () {
  document.getElementById("modal").style.display = "none";
};
