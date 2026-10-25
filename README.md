# Pip — ChatGPT & Claude Mascot

A tiny companion for your AI chats. Pip brings a little personality to **ChatGPT** and **Claude** with interactive mascots right inside your browser.

**Pip adapts to the platform:**
- **ChatGPT:** A cute chibi robot.
- **Claude:** A pixel-art character.

Customize Pip's appearance, size, language, voice, and position through the extension popup.

## Features

- **Two mascots** — Different characters for ChatGPT and Claude.
- **Interactive** — Click to nudge, double-click to say hello, or drag to move.
- **Customizable** — Change the character, size, language, and voice.
- **Keyboard shortcut** — Press `Alt + M` to hide or show Pip.
- **Position reset** — Restore Pip's default position anytime.
- **Lightweight** — Runs directly in your browser.

## Installation

Compatible with **Google Chrome, Microsoft Edge, and Brave**.

1. Download or clone this repository.
2. Extract the ZIP archive if you downloaded one.
3. Open `chrome://extensions` in your browser.
4. Enable **Developer mode**.
5. Click **Load unpacked** and select the extracted project folder.
6. Open or refresh [ChatGPT](https://chatgpt.com) or [Claude](https://claude.ai).

## Controls

| Action | Control |
|---|---|
| Hide / Show Pip | `Alt + M` |
| Nudge Pip | Single-click |
| Say hello | Double-click |
| Move Pip | Click and drag |
| Customize Pip | Extension popup |
| Reset position | Extension popup |

## Troubleshooting

If Pip stops interacting with the page after a website update, the DOM selectors may need to be updated.

Open `content.js` and review the `SELS` selectors near the beginning of the file:

- `stop` — Stop-generation control
- `editor` — Message input area
- `assistant` — Assistant response element

Update the selectors to match the website's current interface, then reload the extension from `chrome://extensions`.

---

# Pip — ChatGPT ve Claude Maskotu

Yapay zekâ sohbetlerine biraz karakter katın! Pip, **ChatGPT** ve **Claude** üzerinde tarayıcınızın içinde yaşayan etkileşimli maskotlar sunar.

**Pip, kullandığınız platforma göre değişir:**
- **ChatGPT:** Sevimli, chibi tarzında bir robot.
- **Claude:** Piksel sanat tarzında bir karakter.

Eklenti açılır penceresinden karakteri, boyutunu, dili, sesi ve konumunu özelleştirebilirsiniz.

## Özellikler

- **İki farklı maskot** — ChatGPT ve Claude için farklı karakterler.
- **Etkileşimli kullanım** — Tek tıklamayla dürtün, çift tıklamayla selam verdirin veya sürükleyerek taşıyın.
- **Kişiselleştirme** — Karakteri, boyutu, dili ve sesi değiştirin.
- **Klavye kısayolu** — `Alt + M` ile Pip'i gizleyin veya gösterin.
- **Konumu sıfırlama** — Varsayılan konuma istediğiniz zaman dönün.
- **Hafif yapı** — Doğrudan tarayıcınızda çalışır.

## Kurulum

**Google Chrome, Microsoft Edge ve Brave** ile uyumludur.

1. Bu depoyu indirin veya klonlayın.
2. ZIP arşivini indirdiyseniz bir klasöre çıkarın.
3. Tarayıcınızda `chrome://extensions` adresini açın.
4. **Geliştirici modu** seçeneğini etkinleştirin.
5. **Paketlenmemiş öğe yükle** seçeneğine tıklayın ve proje klasörünü seçin.
6. [ChatGPT](https://chatgpt.com) veya [Claude](https://claude.ai) sayfasını açın ya da yenileyin.

## Kontroller

| İşlem | Kontrol |
|---|---|
| Pip'i gizle / göster | `Alt + M` |
| Pip'i dürt | Tek tıklama |
| Selam vermesini sağla | Çift tıklama |
| Pip'i taşı | Tıklayıp sürükleme |
| Ayarları değiştir | Eklenti açılır penceresi |
| Konumu sıfırla | Eklenti açılır penceresi |

## Sorun Giderme

Web sitelerindeki arayüz değişikliklerinden sonra Pip'in etkileşimleri çalışmazsa DOM seçicilerinin güncellenmesi gerekebilir.

`content.js` dosyasının başındaki `SELS` seçicilerini kontrol edin:

- `stop` — Yanıt oluşturmayı durdurma kontrolü
- `editor` — Mesaj giriş alanı
- `assistant` — Asistan yanıtı öğesi

Seçicileri sitenin güncel arayüzüne göre düzenleyin ve ardından `chrome://extensions` üzerinden eklentiyi yeniden yükleyin.
