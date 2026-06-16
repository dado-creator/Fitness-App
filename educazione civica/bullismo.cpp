#include <iostream>
#include <vector>
#include <string>
#include <cctype>

using namespace std;

struct CasoBullismo {
    string nome;
    string cognome;
    int tipologia;
};

void visualizzaTipologie() {
    cout << "\nTipologie di bullismo disponibili:\n";
    cout << "  Tipo1 - Aggressione fisica\n";
    cout << "  Tipo2 - Aggressione verbale\n";
    cout << "  Tipo3 - Video o foto denigratorie\n";
    cout << "  Tipo4 - Due o tutte le opzioni scritte sopra\n";
}

int getTipologia() {
    int tipo;
    while (true) {
        cout << "Inserire la tipologia (1-4): ";
        cin >> tipo;
        if (tipo >= 1 && tipo <= 4) {
            return tipo;
        }
        cout << "Errore: Inserire un numero tra 1 e 4.\n";
    }
}

string getTipologiaDescrizione(int tipo) {
    switch(tipo) {
        case 1: return "Aggressione fisica";
        case 2: return "Aggressione verbale";
        case 3: return "Video o foto denigratorie";
        case 4: return "Due o tutte le opzioni scritte sopra";
        default: return "Sconosciuta";
    }
}

int main() {
    vector<CasoBullismo> casi;
    vector<int> contatori(4, 0);
    string risposta;
    bool continua = true;

    cout << "=== SISTEMA DI REGISTRAZIONE CASI DI BULLISMO ===\n";

    while (continua) {
        CasoBullismo novoCaso;

        cout << "\n--- Inserimento nuovo caso ---\n";

        cout << "Nome della vittima: ";
        cin.ignore();
        getline(cin, novoCaso.nome);

        cout << "Cognome della vittima: ";
        getline(cin, novoCaso.cognome);

        visualizzaTipologie();
        novoCaso.tipologia = getTipologia();

        casi.push_back(novoCaso);
        contatori[novoCaso.tipologia - 1]++;

        cout << "\nDesidera inserire un altro caso? (si/no): ";
        cin >> risposta;

        for (char &c : risposta) {
            c = tolower(c);
        }

        if (risposta != "si" && risposta != "sì") {
            continua = false;
        }
    }

    cout << "\n\n=== RIEPILOGO FINALE ===\n";

    cout << "\n--- TOTALE CASI PER TIPOLOGIA ---\n";
    cout << "Tipo1 (Aggressione fisica): " << contatori[0] << " caso/i\n";
    cout << "Tipo2 (Aggressione verbale): " << contatori[1] << " caso/i\n";
    cout << "Tipo3 (Video o foto denigratorie): " << contatori[2] << " caso/i\n";
    cout << "Tipo4 (Due o tutte le opzioni): " << contatori[3] << " caso/i\n";

    cout << "\nTOTALE CASI REGISTRATI: " << casi.size() << "\n";

    cout << "\n--- DETTAGLIO CASI ---\n";
    for (int i = 0; i < casi.size(); i++) {
        cout << "\nCaso " << (i + 1) << ":\n";
        cout << "  Nome: " << casi[i].nome << "\n";
        cout << "  Cognome: " << casi[i].cognome << "\n";
        cout << "  Tipologia: Tipo" << casi[i].tipologia << " - "
             << getTipologiaDescrizione(casi[i].tipologia) << "\n";
    }

    cout << "\n=== FINE PROGRAMMA ===\n";
    return 0;
}
