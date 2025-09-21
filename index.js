module.exports = async function (context, req) {
    context.log('CPF Validation function processed a request.');

    const cpf = (req.query.cpf || (req.body && req.body.cpf));

    if (!cpf) {
        context.res = {
            status: 400,
            body: "Por favor, forneça um CPF na query string ou no corpo da requisição."
        };
        return;
    }

    const isValid = validarCPF(cpf);

    context.res = {
        status: 200,
        body: { cpf: cpf, valido: isValid }
    };
};

// Função simples para validar CPF
function validarCPF(strCPF) {
    strCPF = strCPF.replace(/[^\d]+/g,''); // Remove tudo que não for número
    if (strCPF.length !== 11 || /^(\d)\1+$/.test(strCPF)) return false;

    let soma = 0;
    let resto;

    for (let i=1; i<=9; i++) soma += parseInt(strCPF.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i=1; i<=10; i++) soma += parseInt(strCPF.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11))) return false;

    return true;
}
