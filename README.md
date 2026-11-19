# Mario 2D

Un jeu de plateforme rétro 2D inspiré de Mario, en HTML5/JavaScript pur (aucune dépendance).

## 🎮 Comment jouer

| Touche | Action |
|---|---|
| `←` `→` | Se déplacer |
| `↑` ou `Espace` | Sauter (maintiens pour sauter plus haut) — **2e appui en l'air : double saut !** |
| `↑` `↓` + `Entrée` | Naviguer dans les menus |
| `Échap` | Pause en cours de jeu |
| `Entrée` | Valider / revenir au menu |

## 📜 Menus

- **Menu principal** (au lancement) :
  - **JOUER** — nouvelle partie (3 vies, score remis à zéro)
  - **COMMANDES** — écran d'aide (contrôles, ennemis, boss)
  - **QUITTER** — écran de sortie (« Merci d'avoir joué ») ; dans la version `.exe`/Electron, la fenêtre se ferme automatiquement, sinon il suffit de fermer l'onglet
- **Menu pause** (Échap en jeu) :
  - **REPRENDRE** — reprendre la partie
  - **RECOMMENCER LE NIVEAU** — relancer le niveau courant
  - **MENU PRINCIPAL** — revenir au menu

- **3 niveaux** avec difficulté croissante — **déblocage progressif** : termine un niveau pour débloquer le suivant au menu (sauvegardé en localStorage) ; après chaque niveau, retour au menu
- **Double saut** : ré-appuie sur ↑ / Espace en l'air
- **Blocs à pouvoirs** (frappe-les par en dessous) :
  - `?` → pièce (+100 pts)
  - `★` → **étoile d'invincibilité (9 s, avec jauge)** : arc-en-ciel, écrase TOUS les ennemis au contact (même les Spinys) et détruit les boules de feu ; les boss restent dangereux mais ne peuvent pas te toucher
  - `♥` → **+1 vie** (champignon 1-UP)
- **Ennemis redessinés** : Goombas, Koopas (verts, rapides) et **Spinys** (rouges à pointes — ⚠ impossibles à écraser, les éviter !)
- **Mini-boss en fin de chaque niveau**, barre de 5 PV, arène verrouillée :
  - 👑 **ROI GOOMBA** — crache des boules de feu, saute
  - 🐢 **REX LE KOOPA** — plus rapide, double boules de feu, onde de choc en atterrissant
  - 🔥 **BOWSER** (final, extra dur) — rafales de 3 boules de feu, double ondes de choc, et devient **enragé** (plus vite, plus d'attaques) à chaque coup reçu
  - Pour les vaincre : **5 sauts sur la tête**. Contact par le côté/dessous = mort.
  - Checkpoint à l'arène : si tu meurs, tu recommences directement au combat (les PV infligés au boss sont conservés !)
- **Pièces** (+100 pts) et **blocs `?`** (saute dessous pour libérer une pièce)
- **Trous** : ne tombe pas !
- **Drapeau** en fin de niveau : +1000 pts
- **3 vies**, score et compteur de pièces

## 🚀 Lancer le jeu (serveur local)

### Windows
Double-clique sur **`run.bat`** (Python doit être installé).
Le navigateur s'ouvre automatiquement sur le jeu.

> Bonus : le serveur écoute sur le réseau local — un ami sur le même Wi-Fi
> peut jouer via l'adresse « Sur le réseau » affichée dans la console.

### Linux / macOS
```bash
./run.sh
# ou : python3 server.py 8000
```

## 📦 Faire un vrai .exe

### Option A — la plus simple (recommandée)
1. Convertis le dossier en `.zip` et distribuez-le ; le joueur installe
   [Python](https://www.python.org/downloads/) (coche *Add to PATH*) puis double-clique `run.bat`.

### Option B — un vrai `.exe` autonome avec Electron (multi-plateforme)
```bash
npm init -y
npm install --save-dev electron electron-packager
# crée main.js (voir ci-dessous) puis :
npx electron-packager . Mario2D --platform=win32 --arch=x64 --out=dist
# => dist/Mario2D-win32-x64/Mario2D.exe
```

Crée un fichier `main.js` à côté du jeu :
```js
const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1000, height: 640, autoHideMenuBar: true });
  win.loadFile('index.html');
});
```
> Le packaging d'un `.exe` Windows doit être fait depuis Windows (ou avec Wine).

### Option C — `.exe` sans Node, avec Python embarqué
```bash
pip install pyinstaller
# petite variante : lance server.py puis ouvre le navigateur (déjà fait par server.py)
pyinstaller --onefile --add-data "index.html:." --add-data "game.js:." server.py
```

## 🛠️ Modifier les niveaux

Les niveaux sont définis dans `game.js`, tableau `LEVEL_DEFS` :
```js
a.gap(56, 3);        // trou de 3 tuiles
a.brick(21, 10, 2);  // 2 briques en (21, 10)
a.q(23, 10);         // bloc "?" avec pièce
a.coin(8, 9);        // pièce
a.pipe(30, 3);       // tuyau de hauteur 3
a.enemy(46);         // goomba
a.enemy(76, 'koopa');// koopa
a.enemy(80, 'spiny');// spiny : NON écrasable !
a.flag(120);         // drapeau de fin
a.stairs(100, 4);    // escalier montant
```
Les coordonnées sont en tuiles (x = 0 à gauche, y = 13 = sol, 15 = fond de l'écran).

## 📁 Fichiers

- `index.html` — page du jeu
- `game.js` — tout le moteur (physique, ennemis, niveaux, rendu, sons)
- `server.py` — serveur local
- `run.bat` / `run.sh` — lancement en un clic
