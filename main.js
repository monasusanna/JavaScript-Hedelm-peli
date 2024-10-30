const maksimipanos = 10;
const minimipanos = 1;
let panos = minimipanos;
let rahaa = 100;
let lukitutrullat = [false, false, false, false];
let voittavakierros = false;

const symbolit = [
    'img/paaryna.png',
    'img/kirsikka.png',
    'img/sitruuna.png',
    'img/seitsaman.png',
    'img/rypale.png'
];

document.getElementById('alussarahaa').innerText = rahaa;
document.getElementById('valittupanos').innerText = panos;

panoksetKuville();

function panoksetKuville() {
    const panoskirsikka = panos * 3;
    const panospaaryna = panos * 4;
    const panosrypale = panos * 5;
    const panossitruuna = panos * 6;
    const panosseiskat = panos * 10;
    const panoskolmeseiskaa = panos * 5;

    document.getElementById('panoskirsikka').innerText = panoskirsikka + ' €';
    document.getElementById('panospaaryna').innerText = panospaaryna + ' €';
    document.getElementById('panosrypale').innerText = panosrypale + ' €';
    document.getElementById('panossitruuna').innerText = panossitruuna + ' €';
    document.getElementById('panosseiskat').innerText = panosseiskat + ' €';
    document.getElementById('panoskolmeseiskaa').innerText = panoskolmeseiskaa + ' €';
}

function kasvataPanosta() {
    if (panos < maksimipanos && panos < rahaa) {
        panos++;
    } else {
        panos = minimipanos; 
    }
    document.getElementById('valittupanos').innerText = panos;
    panoksetKuville();
} 

function lukitseRulla(rulla) {
    if (!voittavakierros) {
        lukitutrullat[rulla - 1] = !lukitutrullat[rulla - 1];

        const rullaElementti = document.getElementById('rulla' + rulla);
        const lukitusNappula = document.getElementById('lukitusnappula' + rulla);

        if (lukitutrullat[rulla - 1]) {
            rullaElementti.classList.add('lukitserulla'); 
            lukitusNappula.classList.add('lukitserulla-nappula'); 
        } else {
            rullaElementti.classList.remove('lukitserulla');
            lukitusNappula.classList.remove('lukitserulla-nappula'); 
        }
    } else {
        document.getElementById('tulosviesti').innerText = "Voitit kierroksen, et voi uusia lukitusta";
    }
}

function pyorauta() {
    for (let i = 1; i <= 4; i++) {
        if (!lukitutrullat[i - 1]) {
            const rulla = document.getElementById('rulla' + i);
            const random = Math.floor(Math.random() * symbolit.length);
            const kuvat = rulla.querySelectorAll('img');

            kuvat.forEach((img) => {
                img.src = symbolit[random]; 
            });
        }
    }
    vapautaRullat();

}

function voitot(panos) {
    const tulos = [];
    for (let i = 1; i <= 4; i++) {
        const tulokset = document.getElementById('rulla' + i).querySelector('img').src;
        tulos.push(tulokset);
    }

    let voitto = 0;
    let tulosviesti = "Ei voittoa.";

    const neljat = tulos.reduce((kerta, symbol) => {
        const symbolinnimi = symbol.substring(symbol.lastIndexOf('/') + 1);
        kerta[symbolinnimi] = (kerta[symbolinnimi] || 0) + 1;
        return kerta;
    }, {});
 
    if (neljat['seitsaman.png'] === 4) {
        voitto = 10 * panos;
        tulosviesti = "Voitit " + voitto + " €";
    } else if (neljat['rypale.png'] === 4) {
        voitto = 6 * panos;
        tulosviesti = "Voitit " + voitto + " € ";
    } else if (neljat['sitruuna.png'] === 4) {
        voitto = 5 * panos;
        tulosviesti = "Voitit " + voitto + " € ";
    } else if (neljat['paaryna.png'] === 4) {
        voitto = 4 * panos;
        tulosviesti = "Voitit " + voitto + " € ";
    } else if (neljat['kirsikka.png'] === 4) {
        voitto = 3 * panos;
        tulosviesti = "Voitit " + voitto + " € ";
    }

    const kolmonenSeiska = tulos.filter(symbol => symbol.includes('seitsaman.png')).length;
    if (kolmonenSeiska === 3) {
        voitto = 5 * panos; 
        tulosviesti = "Voitit " + voitto + " € ";
    }
    voittavakierros = voitto > 0;
    return {voitto, tulosviesti};
}

function vapautaRullat() {
    for (let i = 1; i <= 4; i++) {
        lukitutrullat[i - 1] = false; 
        const rullaElementti = document.getElementById('rulla' + i);
        const lukitusNappula = document.getElementById('lukitusnappula' + i);
        
        if (rullaElementti) {
            rullaElementti.classList.remove('lukitserulla');
        }
        if (lukitusNappula) {
            lukitusNappula.classList.remove('lukitserulla-nappula');
        }
    }
}

document.getElementById('kaynnistaKierros').addEventListener('click', () => {
    if (panos > rahaa) {
        document.getElementById('tulosviesti').innerText = "Panos on suurempi kun käytettävissä oleva saldo!";
        document.getElementById('tulosviesti').style.display = 'flex';
        return;
    }

    console.log(tulosviesti);

    rahaa -= panos;
    document.getElementById('alussarahaa').innerText = rahaa;

    pyorauta();

    const tulos = voitot(panos);

    if (tulos.voitto > 0) {
        rahaa += tulos.voitto;
        document.getElementById('alussarahaa').innerText = rahaa;
    }

    document.getElementById('tulosviesti').innerText = tulos.tulosviesti;
    document.querySelector('.tiedotpelaajalle').classList.add('nayta');

    lukitutrullat = [false, false, false, false];
    for (let i = 1; i <= 4; i++) {
        document.getElementById('rulla' + i).classList.remove('lukitserulla');
    }
});