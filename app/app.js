/* CalisthenicsCoach – Disziplin wählen, Form einschätzen, Plan bekommen. */

// ---------- Daten: Disziplinen, Fragen, Level-Logik, Trainingstage ----------

const DISCIPLINES = {
  muscleup: {
    name: 'Muscle Up',
    short: 'Klimmzug-Stütz-Übergang an der Stange',
    intro: 'Der Muscle Up verbindet Zugkraft und Stützkraft in einer explosiven Bewegung. Wir bauen zuerst die Basis, dann den Übergang, dann die saubere Wiederholung.',
    questions: [
      { id: 'pullups', label: 'Wie viele saubere Klimmzüge schaffst du am Stück? (Kinn über die Stange, Arme unten ganz durchgestreckt)', type: 'number', min: 0, max: 40, placeholder: 'z. B. 6' },
      { id: 'dips', label: 'Wie viele saubere Dips schaffst du am Stück? (Barren oder Ringe, Arme oben ganz durchgestreckt)', type: 'number', min: 0, max: 40, placeholder: 'z. B. 6' },
      { id: 'attempted', label: 'Hattest du schon mal einen Muscle Up – und sei es mit viel Schwung?', type: 'bool' },
      { id: 'frequency', label: 'Wie oft willst du pro Woche trainieren?', type: 'freq' }
    ],
    level(a) {
      if (a.pullups < 5 || a.dips < 5) return 1;
      if (a.pullups >= 10 && a.dips >= 10 && a.attempted) return 3;
      if (a.pullups >= 8 && a.dips >= 8) return 3;
      return 2;
    },
    levels: {
      1: {
        label: 'Grundlagen aufbauen',
        summary: 'Deine Zug- und Stützkraft ist noch die Baustelle. Die ersten 8 Wochen bauen genau die auf – der Muscle Up selbst kommt danach viel leichter.',
        days: {
          A: { title: 'Zugkraft', exercises: [
            { name: 'Strict Klimmzüge', base: { sets: 4, reps: 5 }, notes: 'Voller Bewegungsradius, unten ganz durchhängen.' },
            { name: 'Negative Klimmzüge', base: { sets: 3, reps: 5 }, notes: 'Oben starten, 4–5 Sek. kontrolliert ablassen.' },
            { name: 'Aktives Hängen', base: { sets: 3, hold: 15 }, notes: 'Schulterblätter aktiv nach unten ziehen.' }
          ]},
          B: { title: 'Stützkraft & Rumpf', exercises: [
            { name: 'Dips', base: { sets: 4, reps: 5 }, notes: 'Oben und unten ganz durchstrecken.' },
            { name: 'Enge Liegestütze', base: { sets: 3, reps: 10 }, notes: 'Ellbogen nah am Körper, Trizeps-Fokus.' },
            { name: 'Hollow Body Hold', base: { sets: 3, hold: 20 }, notes: 'Unterer Rücken bleibt am Boden.' }
          ]},
          C: { title: 'Technik & Beweglichkeit', exercises: [
            { name: 'False-Grip Hängen', base: { sets: 4, hold: 12 }, notes: 'Handgelenk über die Stange, kurz halten reicht.' },
            { name: 'German Hang / Skin-the-Cat', base: { sets: 3, reps: 4 }, notes: 'Langsam, Schultern warm vorher.' },
            { name: 'Schulter-Mobility', base: { sets: 3, reps: 10 }, notes: 'Bandzerren, Armkreisen, Schulteröffner.' }
          ]}
        }
      },
      2: {
        label: 'Übergang trainieren',
        summary: 'Grundkraft ist da – jetzt üben wir genau die Bewegung, die dir noch fehlt: den Übergang vom Zug in den Stütz.',
        days: {
          A: { title: 'Explosive Zugkraft', exercises: [
            { name: 'Explosive Klimmzüge (Brust zur Stange)', base: { sets: 5, reps: 3 }, notes: 'So schnell wie möglich nach oben ziehen.' },
            { name: 'Chest-to-Bar Klimmzüge', base: { sets: 4, reps: 5 }, notes: 'Brust berührt die Stange oben.' },
            { name: 'False-Grip Klimmzüge', base: { sets: 4, reps: 3 }, notes: 'Mit False Grip ziehen, Handgelenk gewöhnt sich.' }
          ]},
          B: { title: 'Übergangstraining', exercises: [
            { name: 'Jumping oder Banded Muscle Up', base: { sets: 5, reps: 3 }, notes: 'Mit Schwungbein oder Band den Übergang spüren.' },
            { name: 'Dips', base: { sets: 4, reps: 8 }, notes: 'Sauber, volle Range.' },
            { name: 'Straight Bar Dips', base: { sets: 3, reps: 5 }, notes: 'Simuliert die Stützposition an der Stange.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Negative Muscle Up (aus dem Stütz)', base: { sets: 4, reps: 3 }, notes: 'Oben starten, so langsam wie möglich runter.' },
            { name: 'L-Sit Halten', base: { sets: 3, hold: 15 }, notes: 'Auf Parallettes oder am Boden.' },
            { name: 'Handgelenk-Mobility', base: { sets: 3, reps: 10 }, notes: 'Vor allem nach False-Grip-Arbeit wichtig.' }
          ]}
        }
      },
      3: {
        label: 'Feinschliff',
        summary: 'Du bist nah dran. Jetzt geht es um Krafttransfer und darum, den Muscle Up sauber und wiederholbar zu machen.',
        days: {
          A: { title: 'Krafttransfer', exercises: [
            { name: 'Archer oder Weighted Klimmzüge', base: { sets: 4, reps: 5 }, notes: 'Zusatzgewicht nur wenn Technik sauber bleibt.' },
            { name: 'Weighted Dips', base: { sets: 4, reps: 5 }, notes: 'Langsam runter, kontrolliert hoch.' },
            { name: 'False-Grip Chest-to-Bar', base: { sets: 4, reps: 4 }, notes: 'Immer mit False Grip üben.' }
          ]},
          B: { title: 'Muscle-Up-Praxis', exercises: [
            { name: 'Strict Muscle Up Versuche', base: { sets: 5, reps: 2 }, notes: 'Wenig Schwung, Fokus auf sauberen Übergang.' },
            { name: 'Slow Negative Muscle Up', base: { sets: 3, reps: 3 }, notes: '5 Sekunden kontrolliert ablassen.' },
            { name: 'Transition-Drill am Ring oder Bar', base: { sets: 4, reps: 4 }, notes: 'Isoliert genau den Übergangspunkt üben.' }
          ]},
          C: { title: 'Ergänzung & Erholung', exercises: [
            { name: 'Core: Hollow/Arch Wechsel', base: { sets: 3, hold: 25 }, notes: 'Spannung im ganzen Körper halten.' },
            { name: 'Schulter- & Handgelenk-Mobility', base: { sets: 3, reps: 10 }, notes: 'Als aktive Erholung.' },
            { name: 'Technikvideo analysieren', base: { sets: 1, reps: 1 }, notes: 'Video von dir selbst mit Vorbild vergleichen.' }
          ]}
        }
      }
    }
  },

  handstand: {
    name: 'Freistehender Handstand',
    short: 'Balance ohne Wand',
    intro: 'Der freie Handstand ist zu 80 % Balance-Training und zu 20 % Kraft. Wir arbeiten uns von der Wand weg – Schritt für Schritt, ohne Umwege.',
    questions: [
      { id: 'wallHold', label: 'Wie lange hältst du einen Handstand an der Wand (Bauch oder Rücken zur Wand), in Sekunden?', type: 'number', min: 0, max: 300, placeholder: 'z. B. 30' },
      { id: 'freeHold', label: 'Wie lange kannst du dich schon frei balancieren, ganz ohne Wand, in Sekunden? (0, wenn noch nie)', type: 'number', min: 0, max: 120, placeholder: 'z. B. 2' },
      { id: 'pike', label: 'Schaffst du Pike-Liegestütze oder Wand-Handstand-Liegestütze?', type: 'bool' },
      { id: 'frequency', label: 'Wie oft willst du pro Woche trainieren?', type: 'freq' }
    ],
    level(a) {
      if (a.wallHold < 30) return 1;
      if (a.freeHold >= 8 || a.wallHold > 90) return 3;
      return 2;
    },
    levels: {
      1: {
        label: 'Grundlagen aufbauen',
        summary: 'Erst Kraft und Körperspannung an der Wand aufbauen, dann kommt das Freistehen von ganz allein leichter.',
        days: {
          A: { title: 'Kraft & Haltung', exercises: [
            { name: 'Pike-Liegestütze', base: { sets: 4, reps: 8 }, notes: 'Po hoch, Beine möglichst gestreckt.' },
            { name: 'Handstand an der Wand (Bauch zur Wand)', base: { sets: 5, hold: 20 }, notes: 'Gerade Linie von Handgelenk bis Ferse.' },
            { name: 'Hollow Body Hold', base: { sets: 3, hold: 20 }, notes: 'Simuliert die Körperspannung im Handstand.' }
          ]},
          B: { title: 'Balance-Basis', exercises: [
            { name: 'Wall-Walk', base: { sets: 4, reps: 3 }, notes: 'Vom Liegestütz aus die Wand hochlaufen.' },
            { name: 'Chest-to-Wall Handstand', base: { sets: 5, hold: 15 }, notes: 'Rücken zur Wand, Bauch bleibt angespannt.' },
            { name: 'Handgelenk-Mobility', base: { sets: 3, reps: 10 }, notes: 'Vor jeder Handstand-Einheit wichtig.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Frog Stand / Krähenstand', base: { sets: 3, hold: 12 }, notes: 'Baut Arm- und Handbalance auf.' },
            { name: 'Schulterstabilität (Band-Pull-Apart)', base: { sets: 3, reps: 12 }, notes: 'Für gesunde Schultern bei viel Handstand-Arbeit.' },
            { name: 'Hollow Rocks', base: { sets: 3, reps: 10 }, notes: 'Kontrolliert, nicht hetzen.' }
          ]}
        }
      },
      2: {
        label: 'Übergang trainieren',
        summary: 'Die Wand wird zum Trainingspartner statt zur Krücke: kurze freie Balance-Momente einbauen.',
        days: {
          A: { title: 'Balance-Aufbau', exercises: [
            { name: 'Chest-to-Wall Handstand', base: { sets: 5, hold: 25 }, notes: 'Bauch fest, Blick zwischen die Hände.' },
            { name: 'Tuck-Handstand freistehend', base: { sets: 5, hold: 5 }, notes: 'Kurz von der Wand weg balancieren.' },
            { name: 'Handstand-Liegestütz-Negative (an der Wand)', base: { sets: 4, reps: 5 }, notes: 'Kopf knapp über dem Boden abbremsen.' }
          ]},
          B: { title: 'Freies Balancieren', exercises: [
            { name: 'Kick-up mit Spotter oder frei', base: { sets: 6, reps: 5 }, notes: 'Lieber kurz und oft als lang und verkrampft.' },
            { name: 'Pike-Handstand-Übergänge', base: { sets: 4, reps: 4 }, notes: 'Aus dem Sitz in den Handstand drücken.' },
            { name: 'L-Sit auf Parallettes', base: { sets: 3, hold: 15 }, notes: 'Baut die nötige Rumpfspannung mit auf.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Balance-Drill: Blick auf festen Punkt', base: { sets: 5, hold: 8 }, notes: 'Freistehend, Fokuspunkt am Boden vor dir.' },
            { name: 'Handgelenk-Kräftigung', base: { sets: 3, reps: 12 }, notes: 'Handstand-Liegestütz-Vorbereitung.' },
            { name: 'Core & Schulterstabilität', base: { sets: 3, hold: 20 }, notes: 'Als Ergänzung, nicht bis zum Muskelversagen.' }
          ]}
        }
      },
      3: {
        label: 'Feinschliff',
        summary: 'Die Balance steht – jetzt geht es um Ausdauer im Handstand und die ersten Skills obendrauf.',
        days: {
          A: { title: 'Balance-Ausdauer', exercises: [
            { name: 'Freier Handstand halten', base: { sets: 6, hold: 10 }, notes: 'Länge vor Menge – lieber sauber abbrechen.' },
            { name: 'Handstand-Liegestütze (frei oder an der Wand)', base: { sets: 4, reps: 5 }, notes: 'Volle Range, kontrolliert.' },
            { name: 'Press-Ansätze aus dem Sitz', base: { sets: 4, reps: 3 }, notes: 'Baut Kraft für elegante Übergänge auf.' }
          ]},
          B: { title: 'Skills', exercises: [
            { name: 'Handstand-Walking', base: { sets: 5, reps: 4 }, notes: 'Kleine, kontrollierte Schritte.' },
            { name: 'Gewicht verlagern (One-Arm-Vorbereitung)', base: { sets: 4, hold: 8 }, notes: 'Langsam Gewicht auf eine Hand verlagern.' },
            { name: 'Pirouetten im Handstand', base: { sets: 3, reps: 4 }, notes: 'Erst auf weichem Untergrund üben.' }
          ]},
          C: { title: 'Ergänzung & Analyse', exercises: [
            { name: 'Technikvideo analysieren', base: { sets: 1, reps: 1 }, notes: 'Körperlinie mit Vorbildern vergleichen.' },
            { name: 'Schulter- & Handgelenk-Mobility', base: { sets: 3, reps: 10 }, notes: 'Aktive Erholung.' },
            { name: 'Core Finisher', base: { sets: 3, hold: 25 }, notes: 'Hollow Body oder Dragon Flag Negative.' }
          ]}
        }
      }
    }
  },

  frontlever: {
    name: 'Front Lever',
    short: 'Waagerecht hängen, Rücken parallel zum Boden',
    intro: 'Der Front Lever ist reine Zug- und Rumpfkraft in der Länge. Wir gehen über Tuck, Advanced Tuck und Straddle zur vollen Position.',
    questions: [
      { id: 'tuckHold', label: 'Wie lange hältst du einen Tuck Front Lever (Knie eng angezogen), in Sekunden?', type: 'number', min: 0, max: 120, placeholder: 'z. B. 8' },
      { id: 'pullups', label: 'Wie viele saubere Klimmzüge schaffst du am Stück?', type: 'number', min: 0, max: 40, placeholder: 'z. B. 8' },
      { id: 'straddle', label: 'Kannst du schon einen Advanced Tuck oder Straddle Front Lever kurz halten?', type: 'bool' },
      { id: 'frequency', label: 'Wie oft willst du pro Woche trainieren?', type: 'freq' }
    ],
    level(a) {
      if (a.tuckHold < 10 || a.pullups < 8) return 1;
      if (a.straddle || a.tuckHold > 25) return 3;
      return 2;
    },
    levels: {
      1: {
        label: 'Grundlagen aufbauen',
        summary: 'Zugkraft und Rumpfspannung sind die Basis für jede Front-Lever-Position. Hier legen wir das Fundament.',
        days: {
          A: { title: 'Zugkraft-Basis', exercises: [
            { name: 'Strict Klimmzüge', base: { sets: 4, reps: 6 }, notes: 'Voller Bewegungsradius.' },
            { name: 'Tuck Front Lever halten', base: { sets: 5, hold: 8 }, notes: 'Knie eng an die Brust, Rücken rund halten.' },
            { name: 'Aktives Hängen', base: { sets: 3, hold: 15 }, notes: 'Schulterblätter aktiv einsetzen.' }
          ]},
          B: { title: 'Rumpf & Ergänzung', exercises: [
            { name: 'Hollow Body Hold', base: { sets: 4, hold: 20 }, notes: 'Ganzkörperspannung wie im Front Lever.' },
            { name: 'Skin-the-Cat', base: { sets: 3, reps: 5 }, notes: 'Langsam und kontrolliert.' },
            { name: 'Reverse Snow Angel', base: { sets: 3, reps: 10 }, notes: 'Für eine gesunde, starke obere Rückenmuskulatur.' }
          ]},
          C: { title: 'Technik', exercises: [
            { name: 'Ring- oder Bar-Rows (Körper flach)', base: { sets: 4, reps: 8 }, notes: 'Körper so gerade wie möglich halten.' },
            { name: 'Tuck Front Lever Rows', base: { sets: 3, reps: 5 }, notes: 'In der Tuck-Position ziehen.' },
            { name: 'Dehnen unterer Rücken/Lat', base: { sets: 3, hold: 20 }, notes: 'Zum Ausgleich nach dem Training.' }
          ]}
        }
      },
      2: {
        label: 'Übergang trainieren',
        summary: 'Die Beine strecken sich langsam – Advanced Tuck und Straddle stehen jetzt im Fokus.',
        days: {
          A: { title: 'Fortgeschrittene Halte', exercises: [
            { name: 'Advanced Tuck Front Lever halten', base: { sets: 5, hold: 8 }, notes: 'Hüfte leicht öffnen, Knie bleiben an der Brust.' },
            { name: 'Front Lever Rows (Tuck)', base: { sets: 4, reps: 5 }, notes: 'Aus der Halteposition ziehen.' },
            { name: 'Explosive Klimmzüge', base: { sets: 4, reps: 5 }, notes: 'Kraftaufbau für den Übergang.' }
          ]},
          B: { title: 'Straddle-Vorbereitung', exercises: [
            { name: 'One-Leg Front Lever (li/re)', base: { sets: 4, hold: 8 }, notes: 'Ein Bein gestreckt, eines angezogen.' },
            { name: 'Straddle Front Lever Versuche', base: { sets: 5, hold: 5 }, notes: 'Beine weit auseinander nehmen erleichtert es.' },
            { name: 'Dragon Flag Negative', base: { sets: 3, reps: 5 }, notes: 'Langsam und kontrolliert ablassen.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Ring Support Halten', base: { sets: 3, hold: 20 }, notes: 'Für stabile Schultern.' },
            { name: 'Lat-Aktivierung & Skapula-Kontrolle', base: { sets: 3, reps: 10 }, notes: 'Vor dem Hauptsatz als Warm-up geeignet.' },
            { name: 'Mobility Brustwirbelsäule', base: { sets: 3, reps: 8 }, notes: 'Hilft bei der offenen Front-Lever-Haltung.' }
          ]}
        }
      },
      3: {
        label: 'Feinschliff',
        summary: 'Straddle sitzt schon – jetzt geht es um die volle, gestreckte Position.',
        days: {
          A: { title: 'Straddle-Ausdauer', exercises: [
            { name: 'Straddle Front Lever halten', base: { sets: 5, hold: 10 }, notes: 'Beine so weit schließen, wie sauber möglich.' },
            { name: 'Full Front Lever Negative', base: { sets: 4, reps: 4 }, notes: 'Aus dem Stütz langsam in die Waagerechte ablassen.' },
            { name: 'Front Lever Rows (Straddle/Full)', base: { sets: 4, reps: 5 }, notes: 'Je enger die Beine, desto schwerer.' }
          ]},
          B: { title: 'Volle Position', exercises: [
            { name: 'Full Front Lever Versuche', base: { sets: 6, hold: 3 }, notes: 'Beine ganz geschlossen und gestreckt.' },
            { name: 'Ice Cream Makers', base: { sets: 3, reps: 5 }, notes: 'Dynamischer Übergang zwischen den Positionen.' },
            { name: 'Dragon Flag', base: { sets: 4, reps: 6 }, notes: 'Volle Range, Schultern als Fixpunkt.' }
          ]},
          C: { title: 'Ergänzung & Analyse', exercises: [
            { name: 'Technikvideo analysieren', base: { sets: 1, reps: 1 }, notes: 'Körperlinie prüfen: Hüfte darf nicht durchhängen.' },
            { name: 'Core Finisher', base: { sets: 3, hold: 25 }, notes: 'Hollow Body oder Plank mit Beinheben.' },
            { name: 'Leichtes Auslaufen', base: { sets: 1, reps: 1 }, notes: 'Aktive Erholung.' }
          ]}
        }
      }
    }
  },

  planche: {
    name: 'Planche',
    short: 'Waagerecht stützen, nur mit den Händen am Boden',
    intro: 'Die Planche fordert extreme Stütz- und Schulterkraft. Wir arbeiten über Lean, Tuck und Straddle zur vollen Position – Handgelenke brauchen dabei besondere Aufmerksamkeit.',
    questions: [
      { id: 'leanHold', label: 'Wie lange hältst du einen Planche-Lean (Liegestütz-Position, Schultern weit vor die Hände geschoben, Füße am Boden), in Sekunden?', type: 'number', min: 0, max: 120, placeholder: 'z. B. 15' },
      { id: 'tuckHold', label: 'Kannst du einen Tuck Planche kurz halten? Wenn ja, wie viele Sekunden? (0, wenn noch nicht)', type: 'number', min: 0, max: 60, placeholder: 'z. B. 0' },
      { id: 'pushups', label: 'Wie viele saubere Liegestütze schaffst du am Stück?', type: 'number', min: 0, max: 60, placeholder: 'z. B. 15' },
      { id: 'frequency', label: 'Wie oft willst du pro Woche trainieren?', type: 'freq' }
    ],
    level(a) {
      if (a.tuckHold < 5) return 1;
      if (a.tuckHold >= 15) return 3;
      return 2;
    },
    levels: {
      1: {
        label: 'Grundlagen aufbauen',
        summary: 'Stützkraft und Schultermobilität sind hier das Fundament – das braucht Geduld, zahlt sich aber aus.',
        days: {
          A: { title: 'Stützkraft', exercises: [
            { name: 'Planche Lean', base: { sets: 5, hold: 12 }, notes: 'Schultern weit vor die Hände schieben.' },
            { name: 'Pseudo Planche Liegestütze', base: { sets: 4, reps: 6 }, notes: 'Hände weiter unten am Körper, Schultern vorschieben.' },
            { name: 'Hollow Body Hold', base: { sets: 3, hold: 20 }, notes: 'Ganzkörperspannung üben.' }
          ]},
          B: { title: 'Schulterstabilität', exercises: [
            { name: 'Support Halten (Ringe oder Boden)', base: { sets: 4, hold: 20 }, notes: 'Arme komplett durchgestreckt.' },
            { name: 'Scapula-Liegestütze', base: { sets: 3, reps: 10 }, notes: 'Nur die Schulterblätter bewegen.' },
            { name: 'Handgelenk-Kräftigung', base: { sets: 3, reps: 12 }, notes: 'Unverzichtbar für Planche-Training.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Tuck Planche Versuche', base: { sets: 5, hold: 3 }, notes: 'Kurz halten reicht am Anfang völlig.' },
            { name: 'L-Sit-Vorbereitung', base: { sets: 3, hold: 10 }, notes: 'Baut die nötige Rumpfspannung mit auf.' },
            { name: 'Beweglichkeit Schulter/Brust', base: { sets: 3, reps: 8 }, notes: 'Aktive Erholung.' }
          ]}
        }
      },
      2: {
        label: 'Übergang trainieren',
        summary: 'Der Tuck Planche sitzt schon kurz – jetzt bauen wir Dauer auf und öffnen langsam die Hüfte.',
        days: {
          A: { title: 'Tuck-Ausdauer', exercises: [
            { name: 'Tuck Planche halten', base: { sets: 5, hold: 8 }, notes: 'Rücken rund, Knie eng an die Brust.' },
            { name: 'Pseudo Planche Liegestütze (fortgeschritten)', base: { sets: 4, reps: 8 }, notes: 'Hände noch weiter unten am Körper.' },
            { name: 'Planche Lean mit Fuß-Entlastung', base: { sets: 3, hold: 15 }, notes: 'Ein Fuß kurz vom Boden abheben.' }
          ]},
          B: { title: 'Straddle-Vorbereitung', exercises: [
            { name: 'Advanced Tuck Planche Versuche', base: { sets: 5, hold: 5 }, notes: 'Hüfte etwas öffnen, Beine bleiben nah am Körper.' },
            { name: 'Dips', base: { sets: 4, reps: 10 }, notes: 'Für zusätzliche Stützkraft.' },
            { name: 'L-Sit Halten', base: { sets: 3, hold: 15 }, notes: 'Auf Parallettes oder am Boden.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Straddle Planche Versuche (kurz)', base: { sets: 4, hold: 3 }, notes: 'Beine weit öffnen erleichtert die Balance.' },
            { name: 'Handgelenk-Mobility', base: { sets: 3, reps: 10 }, notes: 'Vor und nach dem Training.' },
            { name: 'Core Finisher', base: { sets: 3, hold: 20 }, notes: 'Hollow Body oder Plank.' }
          ]}
        }
      },
      3: {
        label: 'Feinschliff',
        summary: 'Der Tuck sitzt sicher – jetzt geht es Richtung Straddle und volle Planche.',
        days: {
          A: { title: 'Straddle-Kraft', exercises: [
            { name: 'Straddle Planche halten', base: { sets: 5, hold: 6 }, notes: 'Beine so weit öffnen, wie für sauberes Halten nötig.' },
            { name: 'Planche-Liegestütze (Tuck/Straddle)', base: { sets: 4, reps: 4 }, notes: 'Volle Kontrolle vor Tempo.' },
            { name: 'Maltese-Vorbereitung (an Ringen)', base: { sets: 3, hold: 5 }, notes: 'Nur wenn Ringe verfügbar sind.' }
          ]},
          B: { title: 'Volle Position', exercises: [
            { name: 'Full Planche Versuche', base: { sets: 6, hold: 3 }, notes: 'Beine ganz geschlossen und gestreckt.' },
            { name: 'Straddle Planche Negative', base: { sets: 4, reps: 4 }, notes: 'Aus dem Stütz langsam in die Straddle-Position senken.' },
            { name: 'Dragon Flag', base: { sets: 4, reps: 6 }, notes: 'Für zusätzliche Rumpfspannung.' }
          ]},
          C: { title: 'Ergänzung & Analyse', exercises: [
            { name: 'Technikvideo analysieren', base: { sets: 1, reps: 1 }, notes: 'Schulterposition und Körperlinie prüfen.' },
            { name: 'Mobility & Regeneration', base: { sets: 3, reps: 8 }, notes: 'Handgelenke besonders beachten.' },
            { name: 'Handgelenkstraining', base: { sets: 3, reps: 12 }, notes: 'Langfristig Verletzungen vorbeugen.' }
          ]}
        }
      }
    }
  },

  pistol: {
    name: 'Pistol Squat',
    short: 'Einbeinige Kniebeuge, freischwebendes Bein gestreckt',
    intro: 'Der Pistol Squat braucht Kraft, Balance und Beweglichkeit im Sprunggelenk gleichzeitig. Wir bauen alle drei parallel auf.',
    questions: [
      { id: 'assistedReps', label: 'Wie viele assistierte Pistol Squats (z. B. an einer Tür oder mit Schlaufe) schaffst du pro Bein?', type: 'number', min: 0, max: 30, placeholder: 'z. B. 5' },
      { id: 'freeReps', label: 'Wie viele freie Pistol Squats schaffst du pro Bein, ganz ohne Hilfe?', type: 'number', min: 0, max: 20, placeholder: 'z. B. 0' },
      { id: 'mobility', label: 'Kommst du in die tiefe Hocke (Fersen bleiben unten) ohne Probleme?', type: 'bool' },
      { id: 'frequency', label: 'Wie oft willst du pro Woche trainieren?', type: 'freq' }
    ],
    level(a) {
      if (a.freeReps < 1) return 1;
      if (a.freeReps >= 5) return 3;
      return 2;
    },
    levels: {
      1: {
        label: 'Grundlagen aufbauen',
        summary: 'Kraft, Balance und Sprunggelenk-Beweglichkeit einzeln aufbauen – dann kommt der erste freie Pistol Squat fast von allein.',
        days: {
          A: { title: 'Kraft-Basis', exercises: [
            { name: 'Bulgarian Split Squats', base: { sets: 4, reps: 10 }, notes: 'Je Bein, hinteres Bein erhöht.' },
            { name: 'Assistierte Pistol Squats (Band/Tür)', base: { sets: 4, reps: 5 }, notes: 'Je Bein, so viel Hilfe wie nötig.' },
            { name: 'Einbeiniges Wadenheben', base: { sets: 3, reps: 12 }, notes: 'Für stabile Sprunggelenke.' }
          ]},
          B: { title: 'Mobility & Stabilität', exercises: [
            { name: 'Tiefe Kniebeugen-Halte', base: { sets: 4, hold: 20 }, notes: 'Fersen bleiben am Boden.' },
            { name: 'Einbeinige Stand-Balance', base: { sets: 3, hold: 20 }, notes: 'Je Seite, Augen bei Fortschritt schließen.' },
            { name: 'Knöchel-Mobility-Drills', base: { sets: 3, reps: 10 }, notes: 'Knie-zur-Wand-Dehnung eignet sich gut.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Box-Pistol-Squats', base: { sets: 4, reps: 5 }, notes: 'Auf eine Erhöhung absetzen, je Bein.' },
            { name: 'Plank', base: { sets: 3, hold: 30 }, notes: 'Für einen stabilen Rumpf bei der Balance.' },
            { name: 'Dehnen Hüftbeuger/Waden', base: { sets: 3, hold: 20 }, notes: 'Nach dem Training.' }
          ]}
        }
      },
      2: {
        label: 'Übergang trainieren',
        summary: 'Der erste freie Pistol Squat ist zum Greifen nah – wir reduzieren die Hilfe Schritt für Schritt.',
        days: {
          A: { title: 'Reduzierte Hilfe', exercises: [
            { name: 'Pistol Squat auf niedriger Box', base: { sets: 4, reps: 5 }, notes: 'Je Bein, Box wird über die Wochen niedriger.' },
            { name: 'Bulgarian Split Squat mit Zusatzgewicht', base: { sets: 4, reps: 8 }, notes: 'Kurzhantel oder Rucksack.' },
            { name: 'Assistierte Pistol (leichte Hilfe)', base: { sets: 3, reps: 6 }, notes: 'Nur noch mit den Fingerspitzen abstützen.' }
          ]},
          B: { title: 'Freie Versuche', exercises: [
            { name: 'Freie Pistol Squats', base: { sets: 5, reps: 3 }, notes: 'Je Bein, so viele wie sauber möglich.' },
            { name: 'Beinbeuger-Vorbereitung (Nordic-Curl-Progression)', base: { sets: 3, reps: 5 }, notes: 'Für die Hüftstreckung wichtig.' },
            { name: 'Einbeiniges Wadenheben', base: { sets: 3, reps: 12 }, notes: 'Weiter Sprunggelenk stabilisieren.' }
          ]},
          C: { title: 'Ergänzung', exercises: [
            { name: 'Mobility Sprunggelenk & Hüfte', base: { sets: 3, reps: 10 }, notes: 'Kurz, aber regelmäßig.' },
            { name: 'Shrimp Squat Versuche', base: { sets: 3, reps: 4 }, notes: 'Je Seite, alternative Standbein-Übung.' },
            { name: 'Core Finisher', base: { sets: 3, hold: 25 }, notes: 'Hollow Body oder Plank.' }
          ]}
        }
      },
      3: {
        label: 'Feinschliff',
        summary: 'Der freie Pistol Squat klappt schon – jetzt geht es um saubere Wiederholungen, Tempo und Zusatzgewicht.',
        days: {
          A: { title: 'Volle Kraft', exercises: [
            { name: 'Freie Pistol Squats (voller Bewegungsradius)', base: { sets: 5, reps: 5 }, notes: 'Je Bein, ganz unten kurz pausieren.' },
            { name: 'Weighted Pistol Squat', base: { sets: 4, reps: 5 }, notes: 'Kurzhantel vor der Brust halten.' },
            { name: 'Shrimp Squats', base: { sets: 4, reps: 5 }, notes: 'Je Seite, fordert zusätzlich die Hüfte.' }
          ]},
          B: { title: 'Kontrolle & Power', exercises: [
            { name: 'Pistol Squat Negative', base: { sets: 4, reps: 5 }, notes: '5 Sekunden kontrolliert absenken.' },
            { name: 'Single-Leg Deadlift', base: { sets: 3, reps: 8 }, notes: 'Für Stabilität in der Hüftstreckung.' },
            { name: 'Jumping Pistol Squat', base: { sets: 3, reps: 4 }, notes: 'Explosive Variante für Power.' }
          ]},
          C: { title: 'Ergänzung & Analyse', exercises: [
            { name: 'Technikvideo analysieren', base: { sets: 1, reps: 1 }, notes: 'Kniestellung und Balance prüfen.' },
            { name: 'Mobility & Regeneration', base: { sets: 3, reps: 8 }, notes: 'Aktive Erholung.' },
            { name: 'Hollow Body Hold', base: { sets: 3, hold: 30 }, notes: 'Core-Finisher.' }
          ]}
        }
      }
    }
  }
};

const FREQ_OPTIONS = [
  { value: 2, label: '2× pro Woche' },
  { value: 3, label: '3× pro Woche' },
  { value: 4, label: '4× pro Woche' },
  { value: 5, label: '5× oder öfter' }
];

const DAY_PATTERNS = {
  2: ['A', 'B'],
  3: ['A', 'B', 'C'],
  4: ['A', 'B', 'C', 'A'],
  5: ['A', 'B', 'C', 'A', 'B']
};

const LEVEL_LABELS = { 1: 'Grundlagen', 2: 'Übergang', 3: 'Feinschliff' };

// ---------- Zustand ----------

let state = {
  disciplineKey: null,
  answers: {},
  viewingHistory: false
};

// ---------- Rendering: Schritt 1 – Disziplin wählen ----------

function renderDisciplineGrid() {
  const grid = document.getElementById('disciplineGrid');
  grid.innerHTML = '';
  Object.entries(DISCIPLINES).forEach(([key, d]) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'discipline-card';
    card.innerHTML = `<h2>${d.name}</h2><p>${d.short}</p>`;
    card.addEventListener('click', () => selectDiscipline(key));
    grid.appendChild(card);
  });
}

function selectDiscipline(key) {
  state.disciplineKey = key;
  state.answers = {};
  renderAssessment();
  goToStep('assessment');
}

// ---------- Rendering: Schritt 2 – Formcheck ----------

function renderAssessment() {
  const d = DISCIPLINES[state.disciplineKey];
  document.getElementById('assessmentTitle').textContent = d.name;
  document.getElementById('assessmentIntro').textContent = d.intro;

  const form = document.getElementById('assessmentForm');
  form.innerHTML = '';

  d.questions.forEach(q => {
    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    label.setAttribute('for', 'q_' + q.id);
    label.textContent = q.label;
    field.appendChild(label);

    if (q.type === 'number') {
      const input = document.createElement('input');
      input.type = 'number';
      input.id = 'q_' + q.id;
      input.name = q.id;
      input.min = q.min;
      input.max = q.max;
      input.placeholder = q.placeholder || '';
      input.required = true;
      field.appendChild(input);
    } else if (q.type === 'bool') {
      const group = document.createElement('div');
      group.className = 'radio-group';
      ['Ja', 'Nein'].forEach(optionLabel => {
        const optId = 'q_' + q.id + '_' + optionLabel;
        const wrap = document.createElement('label');
        wrap.className = 'radio-option';
        wrap.setAttribute('for', optId);
        wrap.innerHTML = `<input type="radio" id="${optId}" name="${q.id}" value="${optionLabel === 'Ja'}" ${optionLabel === 'Nein' ? 'checked' : ''}> ${optionLabel}`;
        group.appendChild(wrap);
      });
      field.appendChild(group);
    } else if (q.type === 'freq') {
      const group = document.createElement('div');
      group.className = 'radio-group';
      FREQ_OPTIONS.forEach((opt, i) => {
        const optId = 'q_' + q.id + '_' + opt.value;
        const wrap = document.createElement('label');
        wrap.className = 'radio-option';
        wrap.setAttribute('for', optId);
        wrap.innerHTML = `<input type="radio" id="${optId}" name="${q.id}" value="${opt.value}" ${i === 1 ? 'checked' : ''}> ${opt.label}`;
        group.appendChild(wrap);
      });
      field.appendChild(group);
    }

    form.appendChild(field);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'primary-btn';
  submitBtn.textContent = 'Meinen Plan erstellen';
  form.appendChild(submitBtn);

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const answers = {};
    d.questions.forEach(q => {
      const raw = data.get(q.id);
      if (q.type === 'number') answers[q.id] = Number(raw) || 0;
      else if (q.type === 'bool') answers[q.id] = raw === 'true';
      else if (q.type === 'freq') answers[q.id] = Number(raw) || 3;
    });
    state.answers = answers;
    state.viewingHistory = false;
    const planData = computePlanData();
    renderPlanData(planData);
    goToStep('plan');
    saveResult(planData);
  };
}

// ---------- Trainingsplan-Logik ----------

function progressExercise(base, week) {
  const isHold = base.hold !== undefined;
  const baseVal = isHold ? base.hold : base.reps;
  const increment = Math.max(1, Math.round(baseVal * 0.12));
  let sets = base.sets;
  let val = baseVal;
  let tag = null;

  if (week === 4) {
    sets = Math.max(2, sets - 1);
    val = baseVal;
    tag = 'Deload-Woche – etwas weniger Umfang, volle Erholung';
  } else if (week === 8) {
    sets = Math.max(2, sets - 2);
    val = baseVal + increment * 6;
    tag = 'Testwoche – heute zählt der Versuch, nicht die Menge';
  } else {
    const stepIndex = week < 4 ? week - 1 : week - 2;
    val = baseVal + increment * stepIndex;
  }

  return { sets, value: Math.max(1, val), isHold, tag };
}

function buildWeekPlan(discipline, level, frequency) {
  const pattern = DAY_PATTERNS[frequency] || DAY_PATTERNS[3];
  const weeks = [];
  for (let week = 1; week <= 8; week++) {
    const days = pattern.map(letter => {
      const dayTemplate = discipline.levels[level].days[letter];
      const exercises = dayTemplate.exercises.map(ex => {
        const prog = progressExercise(ex.base, week);
        return {
          name: ex.name,
          notes: ex.notes,
          sets: prog.sets,
          value: prog.value,
          isHold: prog.isHold,
          tag: prog.tag
        };
      });
      return { title: dayTemplate.title, exercises };
    });
    weeks.push({ week, days });
  }
  return weeks;
}

function computePlanData() {
  const d = DISCIPLINES[state.disciplineKey];
  const level = d.level(state.answers);
  const frequency = state.answers.frequency || 3;
  const levelInfo = d.levels[level];
  const weeks = buildWeekPlan(d, level, frequency);
  return {
    disciplineKey: state.disciplineKey,
    disciplineName: d.name,
    levelKey: level,
    levelLabel: LEVEL_LABELS[level],
    levelSummary: levelInfo.summary,
    frequency,
    answers: state.answers,
    weeks
  };
}

function renderPlanData(data) {
  document.getElementById('planTitle').textContent = `Dein Plan: ${data.disciplineName}`;
  document.getElementById('planLevelBadge').textContent = `Level: ${data.levelLabel}`;
  document.getElementById('planIntro').textContent = data.levelSummary;
  document.getElementById('saveStatus').textContent = '';
  document.getElementById('planBackBtn').style.display = state.viewingHistory ? 'none' : '';

  const container = document.getElementById('planWeeks');
  container.innerHTML = '';

  data.weeks.forEach(w => {
    const weekCard = document.createElement('section');
    weekCard.className = 'week-card';
    if (w.week === 4) weekCard.classList.add('deload');
    if (w.week === 8) weekCard.classList.add('test-week');

    const heading = document.createElement('h3');
    heading.textContent = `Woche ${w.week}`;
    if (w.week === 4) heading.innerHTML += ' <span class="week-flag">Deload</span>';
    if (w.week === 8) heading.innerHTML += ' <span class="week-flag">Test</span>';
    weekCard.appendChild(heading);

    const dayGrid = document.createElement('div');
    dayGrid.className = 'day-grid';

    w.days.forEach((day, idx) => {
      const dayBlock = document.createElement('div');
      dayBlock.className = 'day-block';
      dayBlock.innerHTML = `<h4>Tag ${idx + 1}: ${day.title}</h4>`;

      const list = document.createElement('ul');
      day.exercises.forEach(ex => {
        const li = document.createElement('li');
        const measure = ex.isHold ? `${ex.value} Sek. Halten` : `${ex.value} Wdh.`;
        li.innerHTML = `<strong>${ex.name}</strong> — ${ex.sets} Sätze × ${measure}` +
          (ex.tag ? `<span class="ex-tag">${ex.tag}</span>` : '') +
          `<span class="ex-notes">${ex.notes}</span>`;
        list.appendChild(li);
      });

      dayBlock.appendChild(list);
      dayGrid.appendChild(dayBlock);
    });

    weekCard.appendChild(dayGrid);
    container.appendChild(weekCard);
  });
}

// ---------- Konto & gespeicherte Pläne ----------

async function loadUserInfo() {
  try {
    const res = await fetch('/api/me');
    if (!res.ok) return;
    const me = await res.json();
    document.getElementById('userEmail').textContent = me.name || me.email || '';
  } catch (err) {
    console.error('Konnte Nutzerinfo nicht laden', err);
  }
}

async function saveResult(planData) {
  const statusEl = document.getElementById('saveStatus');
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    if (!res.ok) throw new Error('save failed');
    statusEl.textContent = 'Plan in deinem Konto gespeichert.';
  } catch (err) {
    console.error('Plan konnte nicht gespeichert werden', err);
    statusEl.textContent = 'Plan konnte nicht gespeichert werden.';
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    return '';
  }
}

async function loadHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '<p class="lead">Lädt …</p>';
  try {
    const res = await fetch('/api/results');
    if (!res.ok) throw new Error('load failed');
    const rows = await res.json();
    if (rows.length === 0) {
      list.innerHTML = '<p class="lead">Du hast noch keinen Plan gespeichert. Erstelle oben einen neuen Plan – er landet automatisch hier.</p>';
      return;
    }
    list.innerHTML = '';
    rows.forEach(row => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `
        <div class="history-info">
          <h3>${row.discipline_name}</h3>
          <p class="history-meta">Level: ${row.level_label} · ${row.frequency}× pro Woche · ${formatDate(row.created_at)}</p>
        </div>
        <div class="history-actions">
          <button class="ghost-btn view-btn" type="button">Ansehen</button>
          <button class="ghost-btn delete-btn" type="button">Löschen</button>
        </div>`;
      card.querySelector('.view-btn').addEventListener('click', () => viewSavedResult(row.id));
      card.querySelector('.delete-btn').addEventListener('click', () => deleteSavedResult(row.id, card));
      list.appendChild(card);
    });
  } catch (err) {
    console.error('Verlauf konnte nicht geladen werden', err);
    list.innerHTML = '<p class="lead">Verlauf konnte nicht geladen werden.</p>';
  }
}

async function viewSavedResult(id) {
  try {
    const res = await fetch('/api/results/' + id);
    if (!res.ok) throw new Error('load failed');
    const row = await res.json();
    state.disciplineKey = row.discipline_key;
    state.viewingHistory = true;
    renderPlanData({
      disciplineName: row.discipline_name,
      levelLabel: row.level_label,
      levelSummary: row.level_summary,
      weeks: row.weeks
    });
    goToStep('plan');
  } catch (err) {
    console.error('Plan konnte nicht geladen werden', err);
  }
}

async function deleteSavedResult(id, cardEl) {
  if (!window.confirm('Diesen gespeicherten Plan wirklich löschen?')) return;
  try {
    const res = await fetch('/api/results/' + id, { method: 'DELETE' });
    if (!res.ok) throw new Error('delete failed');
    cardEl.remove();
  } catch (err) {
    console.error('Plan konnte nicht gelöscht werden', err);
  }
}

// ---------- Navigation ----------

function goToStep(stepName) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + stepName).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDisciplineGrid();
  loadUserInfo();

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.dataset.back));
  });

  document.getElementById('historyNavBtn').addEventListener('click', () => {
    loadHistory();
    goToStep('history');
  });

  document.getElementById('printPlanBtn').addEventListener('click', () => window.print());
  document.getElementById('restartBtn').addEventListener('click', () => {
    state = { disciplineKey: null, answers: {}, viewingHistory: false };
    goToStep('discipline');
  });
});
