const database = {
  "england": {
    "name": "إنجلترا",
    "leagues": {
      "premier-league": {
        "name": "Premier League",
        "clubs": [
          "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur", "West Ham United", "Wolverhampton Wanderers"
        ]
      }
    }
  },
  "spain": {
    "name": "إسبانيا",
    "leagues": {
      "laliga": {
        "name": "La Liga",
        "clubs": [
          "Alavés", "Athletic Club", "Atlético Madrid", "Barcelona", "Celta Vigo", "Espanyol", "Getafe", "Girona", "Las Palmas", "Leganés", "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Sociedad", "Sevilla", "Valencia", "Valladolid", "Villarreal"
        ]
      }
    }
  },
  "germany": {
    "name": "ألمانيا",
    "leagues": {
      "bundesliga": {
        "name": "Bundesliga",
        "clubs": [
          "Augsburg", "Bayer Leverkusen", "Bayern Munich", "Bochum", "Borussia Dortmund", "Borussia Mönchengladbach", "Eintracht Frankfurt", "Freiburg", "Heidenheim", "Hoffenheim", "Holstein Kiel", "Mainz 05", "RB Leipzig", "St. Pauli", "Stuttgart", "Union Berlin", "Werder Bremen", "Wolfsburg"
        ]
      }
    }
  },
  "italy": {
    "name": "إيطاليا",
    "leagues": {
      "serie-a": {
        "name": "Serie A",
        "clubs": [
          "Atalanta", "Bologna", "Cagliari", "Como", "Empoli", "Fiorentina", "Genoa", "Hellas Verona", "Inter Milan", "Juventus", "Lazio", "Lecce", "AC Milan", "Monza", "Napoli", "Parma", "Roma", "Torino", "Udinese", "Venezia"
        ]
      }
    }
  },
  "france": {
    "name": "فرنسا",
    "leagues": {
      "ligue-1": {
        "name": "Ligue 1",
        "clubs": [
          "Angers", "Auxerre", "Brest", "Le Havre", "Lens", "Lille", "Lyon", "Marseille", "Monaco", "Montpellier", "Nantes", "Nice", "Paris Saint-Germain", "Reims", "Rennes", "Saint-Étienne", "Strasbourg", "Toulouse"
        ]
      }
    }
  }
};

const formations = {
  '4-4-2': [ [1], [4], [4], [2] ],
  '4-4-1-1': [ [1], [4], [4], [1], [1] ],
  '4-1-2-1-2': [ [1], [4], [1], [2], [1], [2] ], // Diamond
  '4-1-3-2': [ [1], [4], [1], [3], [2] ],
  '4-2-3-1': [ [1], [4], [2], [3], [1] ],
  '4-2-2-2': [ [1], [4], [2], [2], [2] ],
  '4-2-4': [ [1], [4], [2], [4] ],
  '4-3-3': [ [1], [4], [3], [3] ],
  '4-1-4-1': [ [1], [4], [1], [4], [1] ],
  '4-3-2-1': [ [1], [4], [3], [2], [1] ],
  '4-5-1': [ [1], [4], [5], [1] ],
  '4-6-0': [ [1], [4], [6] ],
  '3-4-3': [ [1], [3], [4], [3] ],
  '3-4-2-1': [ [1], [3], [4], [2], [1] ],
  '3-4-1-2': [ [1], [3], [4], [1], [2] ],
  '3-2-4-1': [ [1], [3], [2], [4], [1] ],
  '3-1-3-3': [ [1], [3], [1], [3], [3] ],
  '5-2-2-1': [ [1], [5], [2], [2], [1] ],
  '5-4-1': [ [1], [5], [4], [1] ],
  '3-5-2': [ [1], [3], [5], [2] ],
  '3-5-1-1': [ [1], [3], [5], [1], [1] ],
  '5-3-2': [ [1], [5], [3], [2] ],
};
