'use strict';

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

printSection('Zadanie 1 - Wizytówka użytkownika');

const user = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  city: 'Katowice',
  age: 21,
  fieldOfStudy: 'informatyka',
  favoriteLanguage: 'TypeScript'
};

const fullName = `${user.firstName} ${user.lastName}`;

console.log(fullName);
console.log(`${user.firstName} mieszka w ${user.city} i studiuje ${user.fieldOfStudy}.`);
console.log(user.age >= 18 ? `${fullName} jest pełnoletni.` : `${fullName} jest niepełnoletni.`);
console.log(`Ulubiony język programowania ${user.firstName} to ${user.favoriteLanguage}.`);

printSection('Zadanie 2 - Kalkulator budżetu tygodniowego');

const expenses = [18.5, 42, 9.99, 27, 61.3, 15, 33.5];
const totalExpenses = expenses.reduce((sum, expense) => sum + expense, 0);
const averageExpense = totalExpenses / expenses.length;
const maxExpense = expenses.reduce((currentMax, expense) => Math.max(currentMax, expense), expenses[0]);
const budgetLimit = 200;

console.log(`Suma wydatków: ${totalExpenses.toFixed(2)} zł`);
console.log(`Średni wydatek: ${averageExpense.toFixed(2)} zł`);
console.log(`Największy wydatek: ${maxExpense.toFixed(2)} zł`);
console.log(totalExpenses > budgetLimit ? 'Budżet został przekroczony.' : 'Budżet mieści się w założonym limicie.');

printSection('Zadanie 3 - Lista zakupów z priorytetami');

const shoppingList = [
  { name: 'chleb', quantity: 2, urgent: true },
  { name: 'mleko', quantity: 1, urgent: false },
  { name: 'jajka', quantity: 10, urgent: true },
  { name: 'makaron', quantity: 3, urgent: false }
];

const shoppingSummary = shoppingList.map(item => `- ${item.name} x${item.quantity}${item.urgent ? ' [pilne]' : ''}`);
const urgentItems = shoppingList.filter(item => item.urgent);
const upperCaseNames = shoppingList.map(item => item.name.toUpperCase());
const totalQuantity = shoppingList.reduce((sum, item) => sum + item.quantity, 0);

console.log('Pełna lista zakupów:');
shoppingSummary.forEach(line => console.log(line));
console.log(`Pozycji pilnych: ${urgentItems.length}`);
console.log(`Nazwy po transformacji: ${upperCaseNames.join(', ')}`);
console.log(`Łączna liczba sztuk produktów: ${totalQuantity}`);

printSection('Zadanie 4 - Decyzja: co zabrać na uczelnię');

const hasLaptop = true;
const hasCharger = false;
const hasNotebook = true;
const hasStudentCard = true;
const dayType = 'laboratorium';

const isReadyForClasses = hasLaptop && hasCharger && hasNotebook;

if (isReadyForClasses) {
  console.log('Student jest gotowy na zajęcia.');
} else {
  console.log('Student nie jest jeszcze gotowy na zajęcia.');
}

console.log(isReadyForClasses ? 'Status: gotowy.' : 'Status: niegotowy.');
!hasCharger && console.log('Ostrzeżenie: brakuje ładowarki.');
!hasStudentCard && console.log('Ostrzeżenie: warto zabrać legitymację studencką.');
console.log(dayType === 'laboratorium' ? 'Dziś trzeba przygotować się na pracę praktyczną.' : 'Dziś zapowiada się wykład.');

printSection('Zadanie 5 - Generator planu dnia');

function createDayPlan(name, tasks = ['zajęcia', 'zakupy', 'trening']) {
  const numberedTasks = tasks.map((task, index) => `${index + 1}. ${task}`);

  return [
    `${name}, oto Twój plan dnia:`,
    ...numberedTasks,
    `Liczba zadań: ${tasks.length}`
  ].join('\n');
}

console.log(createDayPlan('Ola', ['zajęcia', 'biblioteka', 'trening']));
console.log(createDayPlan('Piotr'));

printSection('Zadanie 6 - Katalog filmów do obejrzenia');

const movies = [
  { title: 'Arrival', category: 'sci-fi', rating: 8.1, watched: true, year: 2016 },
  { title: 'Whiplash', category: 'drama', rating: 8.5, watched: false, year: 2014 },
  { title: 'Dune', category: 'sci-fi', rating: 8.0, watched: false, year: 2021 },
  { title: 'Inside Out', category: 'animation', rating: 8.1, watched: true, year: 2015 }
];

const unwatchedMovies = movies.filter(movie => !movie.watched);
const highlyRatedMovies = movies.filter(movie => movie.rating > 8.0);
const highlyRatedTitles = highlyRatedMovies.map(movie => movie.title);
const averageMovieRating = movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length;

console.log('Filmy jeszcze nieobejrzane:');
unwatchedMovies.forEach(movie => console.log(`- ${movie.title} (${movie.year})`));
console.log('Filmy z oceną większą niż 8.0:');
highlyRatedTitles.forEach(title => console.log(`- ${title}`));
console.log(`Średnia ocena całego katalogu: ${averageMovieRating.toFixed(2)}`);

printSection('Zadanie 7 - Rejestr napraw w serwisie');

const repairs = [
  { id: 1, client: 'Anna', device: 'laptop', status: 'nowe', priority: 'wysoki' },
  { id: 2, client: 'Piotr', device: 'telefon', status: 'w trakcie', priority: 'średni' },
  { id: 3, client: 'Ola', device: 'tablet', status: 'zakończone', priority: 'niski' }
];

const searchedRepairId = 2;
const foundRepair = repairs.find(repair => repair.id === searchedRepairId);
const updatedRepairs = repairs.map(repair => (
  repair.id === searchedRepairId
    ? { ...repair, status: 'gotowe do odbioru' }
    : repair
));
const inProgressCount = repairs.filter(repair => repair.status === 'w trakcie').length;
const highPriorityCount = repairs.filter(repair => repair.priority === 'wysoki').length;

console.log('Oryginalna tablica zgłoszeń:');
repairs.forEach(repair => console.log(`- #${repair.id} ${repair.client} / ${repair.device} / ${repair.status}`));
console.log('Zaktualizowana tablica zgłoszeń:');
updatedRepairs.forEach(repair => console.log(`- #${repair.id} ${repair.client} / ${repair.device} / ${repair.status}`));
console.log(foundRepair ? `Znaleziono zgłoszenie: #${foundRepair.id} - ${foundRepair.client}` : 'Nie znaleziono zgłoszenia o podanym id.');
console.log(`Liczba zgłoszeń w trakcie: ${inProgressCount}`);
console.log(`Liczba zgłoszeń o wysokim priorytecie: ${highPriorityCount}`);
