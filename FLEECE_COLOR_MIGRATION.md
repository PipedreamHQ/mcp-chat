# Guide de Migration - Palette de Couleurs Fleece AI

## 📊 Palette Officielle

```javascript
// Import
import { fleeceColors } from '@/lib/fleece-theme'

// Couleurs disponibles
fleeceColors.background.primary    // #FFFFFF - Blanc
fleeceColors.background.secondary  // #1C1C1C - Gris foncé
fleeceColors.text.primary          // #0F0F0F - Noir charbon
fleeceColors.text.secondary        // #6B7280 - Gris moyen
fleeceColors.accent.primary        // #2FD6E3 - Cyan IA (signature Fleece AI)
fleeceColors.services.consulting   // #2FD6E3 - Cyan
fleeceColors.services.automations  // #8B5CF6 - Violet
fleeceColors.services.formations   // #10B981 - Vert
```

## ✅ Fichiers Déjà Migrés

- ✅ `lib/fleece-theme.ts` - Configuration des couleurs
- ✅ `lib/ai/fleece-prompts.ts` - Renommé Training → Formations
- ✅ `app/(chat)/fleece/page.tsx` - Dashboard avec palette officielle
- ✅ `app/(chat)/api/fleece/formations/` - Routes API renommées
- ✅ `app/(chat)/fleece/formations/` - Pages UI renommées

## 🔄 Fichiers à Migrer

Pour appliquer la palette complète aux pages restantes, remplacer les anciennes couleurs par les nouvelles :

### 1. Consulting Page (`app/(chat)/fleece/consulting/page.tsx`)

```tsx
// Remplacer
from-blue-50 to-slate-100 → style={{ backgroundColor: fleeceColors.background.primary }}
text-blue-600 → style={{ color: fleeceColors.services.consulting }}
bg-blue-600 hover:bg-blue-700 → style={{ backgroundColor: fleeceColors.services.consulting }}
```

### 2. Automatisations Page (`app/(chat)/fleece/automations/page.tsx`)

```tsx
// Remplacer
from-purple-50 to-slate-100 → style={{ backgroundColor: fleeceColors.background.primary }}
text-purple-600 → style={{ color: fleeceColors.services.automations }}
bg-purple-600 hover:bg-purple-700 → style={{ backgroundColor: fleeceColors.services.automations }}
```

### 3. Formations Page (`app/(chat)/fleece/formations/page.tsx`)

```tsx
// Remplacer
from-green-50 to-slate-100 → style={{ backgroundColor: fleeceColors.background.primary }}
text-green-600 → style={{ color: fleeceColors.services.formations }}
bg-green-600 hover:bg-green-700 → style={{ backgroundColor: fleeceColors.services.formations }}
```

## 🎨 Pattern de Migration

### Exemple: Avant
```tsx
<div className="bg-blue-600 text-white">
  <h1 className="text-2xl text-blue-600">Title</h1>
</div>
```

### Exemple: Après
```tsx
import { fleeceColors } from '@/lib/fleece-theme'

<div style={{ backgroundColor: fleeceColors.services.consulting, color: fleeceColors.background.primary }}>
  <h1 className="text-2xl" style={{ color: fleeceColors.services.consulting }}>Title</h1>
</div>
```

## 🖼️ Logos

Place les logos dans `public/logos/`:

1. **fleece-ai-suite.svg** - Logo principal (dashboard header)
2. **fleece-ai-consulting.svg** - Consulting service
3. **fleece-ai-automatisations.svg** - Automatisations service
4. **fleece-ai-formations.svg** - Formations service

### Utilisation:

```tsx
<img
  src="/logos/fleece-ai-suite.svg"
  alt="Fleece AI"
  className="h-12"
/>
```

## 🚀 Prochaines Étapes

1. Ajouter les fichiers logo dans `public/logos/`
2. Migrer les 3 pages de services (consulting, automations, formations)
3. Vérifier tous les composants pour cohérence visuelle
4. Tester le responsive design
5. Valider l'accessibilité des contrastes

## 📝 Notes

- La couleur **Cyan #2FD6E3** est la couleur signature de Fleece AI
- Utiliser le **Blanc #FFFFFF** comme fond principal
- Le **Noir charbon #0F0F0F** assure un bon contraste pour le texte
- Les 3 services ont chacun leur couleur distinctive

## 🎯 Checklist Finale

- [ ] Tous les textes utilisent `fleeceColors.text.primary` ou `.secondary`
- [ ] Tous les fonds utilisent `fleeceColors.background.primary`
- [ ] Les boutons de services utilisent leurs couleurs respectives
- [ ] Les logos sont intégrés dans toutes les pages
- [ ] Le design est cohérent sur toutes les pages
- [ ] Les couleurs respectent les ratios de contraste WCAG AA
