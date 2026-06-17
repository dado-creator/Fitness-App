import java.util.ArrayList;
import java.util.Scanner;

public class BullismoApp {

    static class CasoBullismo {
        String nome;
        String cognome;
        int tipologia;

        public CasoBullismo(String nome, String cognome, int tipologia) {
            this.nome = nome;
            this.cognome = cognome;
            this.tipologia = tipologia;
        }

        public String getTipologiaDescrizione() {
            switch (this.tipologia) {
                case 1:
                    return "Aggressione fisica";
                case 2:
                    return "Aggressione verbale";
                case 3:
                    return "Video o foto denigratorie";
                case 4:
                    return "Due o tutte le opzioni scritte sopra";
                default:
                    return "Sconosciuta";
            }
        }
    }

    static void visualizzaTipologie() {
        System.out.println("\nTipologie di bullismo disponibili:");
        System.out.println("  Tipo1 - Aggressione fisica");
        System.out.println("  Tipo2 - Aggressione verbale");
        System.out.println("  Tipo3 - Video o foto denigratorie");
        System.out.println("  Tipo4 - Due o tutte le opzioni scritte sopra");
    }

    static int getTipologia(Scanner scanner) {
        int tipo;
        while (true) {
            System.out.print("Inserire la tipologia (1-4): ");
            try {
                tipo = scanner.nextInt();
                if (tipo >= 1 && tipo <= 4) {
                    return tipo;
                }
                System.out.println("Errore: Inserire un numero tra 1 e 4.");
            } catch (Exception e) {
                System.out.println("Errore: Inserire un numero valido.");
                scanner.nextLine();
            }
        }
    }

    static String getNome(Scanner scanner) {
        System.out.print("Nome della vittima: ");
        return scanner.nextLine().trim();
    }

    static String getCognome(Scanner scanner) {
        System.out.print("Cognome della vittima: ");
        return scanner.nextLine().trim();
    }

    static boolean chiediContinuazione(Scanner scanner) {
        System.out.print("\nDesidera inserire un altro caso? (si/no): ");
        String risposta = scanner.nextLine().toLowerCase().trim();
        return risposta.equals("si") || risposta.equals("sì");
    }

    static void stampaRiepilogo(ArrayList<CasoBullismo> casi) {
        int[] contatori = new int[4];

        for (CasoBullismo caso : casi) {
            contatori[caso.tipologia - 1]++;
        }

        System.out.println("\n\n=== RIEPILOGO FINALE ===");

        System.out.println("\n--- TOTALE CASI PER TIPOLOGIA ---");
        System.out.println("Tipo1 (Aggressione fisica): " + contatori[0] + " caso/i");
        System.out.println("Tipo2 (Aggressione verbale): " + contatori[1] + " caso/i");
        System.out.println("Tipo3 (Video o foto denigratorie): " + contatori[2] + " caso/i");
        System.out.println("Tipo4 (Due o tutte le opzioni): " + contatori[3] + " caso/i");

        System.out.println("\nTOTALE CASI REGISTRATI: " + casi.size());

        System.out.println("\n--- DETTAGLIO CASI ---");
        for (int i = 0; i < casi.size(); i++) {
            CasoBullismo caso = casi.get(i);
            System.out.println("\nCaso " + (i + 1) + ":");
            System.out.println("  Nome: " + caso.nome);
            System.out.println("  Cognome: " + caso.cognome);
            System.out.println("  Tipologia: Tipo" + caso.tipologia + " - " +
                    caso.getTipologiaDescrizione());
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ArrayList<CasoBullismo> casi = new ArrayList<>();
        boolean continua = true;

        System.out.println("=== SISTEMA DI REGISTRAZIONE CASI DI BULLISMO ===");

        while (continua) {
            System.out.println("\n--- Inserimento nuovo caso ---");

            scanner.nextLine();
            String nome = getNome(scanner);
            String cognome = getCognome(scanner);

            visualizzaTipologie();
            int tipologia = getTipologia(scanner);

            CasoBullismo novoCaso = new CasoBullismo(nome, cognome, tipologia);
            casi.add(novoCaso);

            continua = chiediContinuazione(scanner);
        }

        stampaRiepilogo(casi);

        System.out.println("\n=== FINE PROGRAMMA ===");

        scanner.close();
    }
}
