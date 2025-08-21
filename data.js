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
  ,
  "netherlands": {
    "name": "هولندا",
    "leagues": {
      "eredivisie": {
        "name": "Eredivisie",
        "clubs": [
          "Ajax", "PSV", "Feyenoord", "AZ Alkmaar", "Twente", "Utrecht", "Heerenveen", "Groningen", "NEC Nijmegen", "Sparta Rotterdam", "Vitesse", "PEC Zwolle", "Go Ahead Eagles", "Almere City", "Heracles", "RKC Waalwijk", "Fortuna Sittard", "Willem II"
        ]
      }
    }
  },
  "portugal": {
    "name": "البرتغال",
    "leagues": {
      "primeira-liga": {
        "name": "Primeira Liga",
        "clubs": [
          "Benfica", "Porto", "Sporting CP", "Braga", "Vitória SC", "Boavista", "Gil Vicente", "Estoril", "Portimonense", "Famalicão", "Casa Pia", "Rio Ave", "Moreirense", "Arouca", "Farense", "Santa Clara", "Chaves", "Nacional"
        ]
      }
    }
  },
  "belgium": {
    "name": "بلجيكا",
    "leagues": {
      "jupiler-pro-league": {
        "name": "Jupiler Pro League",
        "clubs": [
          "Anderlecht", "Club Brugge", "Royal Antwerp", "Gent", "Genk", "Standard Liège", "Charleroi", "Cercle Brugge", "Union SG", "Oostende", "Mechelen", "Kortrijk", "Sint-Truiden", "Westerlo", "Eupen", "Louvain", "RWDM", "Beerschot"
        ]
      }
    }
  },
  "turkey": {
    "name": "تركيا",
    "leagues": {
      "super-lig": {
        "name": "Süper Lig",
        "clubs": [
          "Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor", "Başakşehir", "Bursaspor", "Konyaspor", "Sivasspor", "Antalyaspor", "Alanyaspor", "Adana Demirspor", "Rizespor", "Kayserispor", "Göztepe", "Gaziantep", "Hatayspor", "Ankaragücü", "Samsunspor"
        ]
      }
    }
  },
  "scotland": {
    "name": "اسكتلندا",
    "leagues": {
      "premiership": {
        "name": "Scottish Premiership",
        "clubs": [
          "Celtic", "Rangers", "Hearts", "Hibernian", "Aberdeen", "Motherwell", "St. Mirren", "Dundee United", "Kilmarnock", "Livingston", "Ross County", "Dundee"
        ]
      }
    }
  },
  "saudi-arabia": {
    "name": "السعودية",
    "leagues": {
      "saudi-pro-league": {
        "name": "Saudi Pro League",
        "clubs": [
          "Al Hilal", "Al Nassr", "Al Ittihad", "Al Ahli", "Al Shabab", "Al Ettifaq", "Al Taawoun", "Al Fateh", "Al Raed", "Al Fayha", "Abha", "Al Tai", "Al Hazem", "Al Okhdood", "Damac", "Khaleej"
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
