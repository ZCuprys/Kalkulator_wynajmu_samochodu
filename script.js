//Przypisanie do kategorii cen za wynajem i spalanie w danej kategorii samochodu

const daneKategorii = {
    'Basic': { cenaZaDobę: 100, spalanie: 6 },
    'Standard': { cenaZaDobę: 130, spalanie: 7 },
    'Medium': { cenaZaDobę: 160, spalanie: 8 },
    'Premium': { cenaZaDobę: 200, spalanie: 10 }
};


//ceny paliw w danym mieście


const cenaPaliwa = {
    'Rzeszów': { paliwo: 6.59},
    'Warszawa': { paliwo: 6.80},
    'Wrocław': { paliwo: 6.65},
    'Gdańsk': { paliwo: 6.66}
};


//Dostępności w danym mieście


const daneDostępności = {
    'Rzeszów': {
        'Basic': { 'Renault Clio': 2},
        'Standard': { 'Toyota Corolla': 3},
        'Medium': { 'Toyota RAV4': 3},
        'Premium': { 'BMW M3': 2}
    },
    'Warszawa': {
        'Basic': { 'Toyota Yaris': 2},
        'Standard': { 'Ford Focus': 2},
        'Medium': { 'Toyota RAV4': 2},
        'Premium': { 'BMW M3': 2}
    },
    'Wrocław': {
        'Basic': { 'Skoda Fabia': 2},
        'Standard': { 'Ford Focus': 3},
        'Medium': { 'Volvo XC60': 2},
        'Premium': { 'Audi A3': 2}
    },
    'Gdańsk': {
        'Basic': { 'Renault Clio': 4},
        'Standard': { 'Toyota Corolla': 2},
        'Medium': { 'Ford Kuga': 2},
        'Premium': { 'Mercedes GLC': 2}
    }
};


//stała mnożnika kategorii (Basic: x1, Standard: x1.3 itd)


const mnożnikKategorii = {
    'Basic': 1,
    'Standard': 1.3,
    'Medium': 1.6,
    'Premium': 2
};


function wybieranieModelu() {
    const miastoWynajmu = document.getElementById('miasto').value;
    const kategoriaWynajmu = document.getElementById('kategoriaSamochodu').value;
    const wybranyModel = document.getElementById('modelSamochodu');

//usuwa wszystkie istniejące opcje w liście rozwijanej modeli samochodów
//iteruje przez wszystkie modele dostępne w daneDostępności dla wybranego miasta (miastoWynajmu) i kategorii samochodu (kategoriaWynajmu).
//Tworzony jest nowy element option. Ustawiane są atrybuty value i text tego elementu na nazwę modelu. Nowa opcja jest dodawana do listy rozwijanej wybranyModel.
//funkcja wybieranieModelu() zaktualizuje listę modeli samochodów w formularzu, dodając opcje np. "Toyota Corolla" po wybraniu kategorii i miasta.

    wybranyModel.innerHTML = '';
    for (let model in daneDostępności[miastoWynajmu][kategoriaWynajmu]) {
        let option = document.createElement('option');
        option.value = model;
        option.text = model;
        wybranyModel.add(option);
    }
    czyDostępny();
}

function czyDostępny() {
    const miastoWynajmu = document.getElementById('miasto').value;
    const kategoriaWynajmu = document.getElementById('kategoriaSamochodu').value;
    const wybranyModel = document.getElementById('modelSamochodu').value;

    //pobieramy wartość odpowiadającą dostępności wybranego modelu samochodu w danym mieście i kategorii dzięki obiektowi daneDostępności. 

    const liczbaDostępnych = daneDostępności[miastoWynajmu][kategoriaWynajmu][wybranyModel];

    //Ustawiamy wartość pola formularza o identyfikatorze dostępnośćSamochodu na wartość zmiennej dostępny. To pole informuje użytkownika o liczbie dostępnych modeli w mieście.

    document.getElementById('dostępnośćSamochodu').value = liczbaDostępnych;
}


//Wyświetlanie błędów w formularzu 


function walidacjaFormularza() {
    const polaFormularza = ['kilometry', 'rokPrawaJazdy', 'dniWynajmu', 'miasto', 'kategoriaSamochodu', 'modelSamochodu'];
    let isValid = true;

    polaFormularza.forEach(pole => {
        const inputElement = document.getElementById(pole);
        var errorElement = document.getElementById(pole + 'Error');

        if (!inputElement.value) {
            errorElement.textContent = `Pole jest wymagane.`;
            isValid = false;
        } else {
            errorElement.textContent = '';
        }
    });

    if (isValid) {
        obliczanieWynajmu();
    }
}

function obliczanieWynajmu() {
    const ilośćKilometrów = document.getElementById('kilometry').value;
    const rokWydPrawaJazdy = document.getElementById('rokPrawaJazdy').value;
    const ileDni = document.getElementById('dniWynajmu').value;
    const miastoWynajmu = document.getElementById('miasto').value;
    const kategoriaWynajmu = document.getElementById('kategoriaSamochodu').value;
    const ilośćDostępnych = document.getElementById('dostępnośćSamochodu').value;

    const obecnyRok = new Date().getFullYear();
    const Ilelat = obecnyRok - rokWydPrawaJazdy;

    if (Ilelat < 3 && kategoriaWynajmu === 'Premium') {
        alert('Nie możesz wypożyczyć samochodu z kategorii Premium mając prawo jazdy mniej niż 3 lata.');
        return;
    }

    let cenaCałkowita = daneKategorii[kategoriaWynajmu].cenaZaDobę * ileDni * mnożnikKategorii[kategoriaWynajmu];

    if (Ilelat < 5) {
        cenaCałkowita *= 1.2;
    }

    if (ilośćDostępnych < 3) {
        cenaCałkowita *= 1.15;
    }

    const kosztPaliwa = (ilośćKilometrów / 100) * daneKategorii[kategoriaWynajmu].spalanie * cenaPaliwa[miastoWynajmu].paliwo;

    const cenaNetto = cenaCałkowita + kosztPaliwa;
    const cenaBrutto = cenaNetto * 1.23;

    document.getElementById('paliwo').innerHTML = `Koszt paliwa: ${kosztPaliwa.toFixed(2)} zł`;
    document.getElementById('kosztCałkowity').innerHTML = `Koszt całkowity: ${cenaCałkowita.toFixed(2)} zł`;
    document.getElementById('kosztNetto').innerHTML = `Koszt netto: ${cenaNetto.toFixed(2)} zł`;
    document.getElementById('kosztBrutto').innerHTML = `Koszt brutto: ${cenaBrutto.toFixed(2)} zł`;
}

// Inicjalizacja z domyślnym miastem i modelami formularza
document.addEventListener('DOMContentLoaded', () => {
    wybieranieModelu();
});