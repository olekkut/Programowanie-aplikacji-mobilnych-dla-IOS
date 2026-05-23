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

printSection('Zadanie 8 - System ocen studentów');

const grades = [3.0, 4.0, 5.0, 3.5, 4.5];

function processGrades(gradesArray) {
  const averageGrade = gradesArray.reduce((acc, curr) => acc + curr, 0) / gradesArray.length;
  const passThreshold = 3.0;
  const isPassed = averageGrade >= passThreshold;
  
  let classification = 'dostateczny';
  if (averageGrade >= 4.5) classification = 'bardzo dobry';
  else if (averageGrade >= 4.0) classification = 'dobry';
  
  return {
    average: averageGrade,
    status: isPassed ? 'zaliczone' : 'niezaliczone',
    classification
  };
}

const result8 = processGrades(grades);
console.log(`Średnia: ${result8.average.toFixed(2)}`);
console.log(`Status: ${result8.status}`);
console.log(`Klasyfikacja: ${result8.classification}`);

printSection('Zadanie 9 - Prosty koszyk sklepu');

const cart = [
  { name: 'Chleb', price: 4.5, quantity: 2 },
  { name: 'Sok', price: 6.2, quantity: 3 },
  { name: 'Masło', price: 7.5, quantity: 1 }
];

const discountThreshold = 30;
const discountPercent = 10;

const cartWithItemTotals = cart.map(item => ({
  ...item,
  itemTotal: item.price * item.quantity
}));

const totalCartValue = cartWithItemTotals.reduce((sum, item) => sum + item.itemTotal, 0);
const discountedValue = totalCartValue > discountThreshold 
  ? totalCartValue * (1 - discountPercent / 100) 
  : totalCartValue;

console.log('Pozycje w koszyku:');
cart.forEach(item => console.log(`- ${item.quantity} × ${item.name}`));
console.log(`Suma przed rabatem: ${totalCartValue.toFixed(2)} zł`);
if (totalCartValue > discountThreshold) {
  console.log(`Zastosowano rabat ${discountPercent}%.`);
}
console.log(`Suma do zapłaty: ${discountedValue.toFixed(2)} zł`);


printSection('Zadanie 10 - Dziennik aktywności sportowej');

const activities = [
  { type: 'bieg', minutes: 35, calories: 320 },
  { type: 'rower', minutes: 50, calories: 410 },
  { type: 'spacer', minutes: 20, calories: 90 },
  { type: 'siłownia', minutes: 60, calories: 450 }
];

const totalMinutes = activities.reduce((sum, act) => sum + act.minutes, 0);
const totalCalories = activities.reduce((sum, act) => sum + act.calories, 0);
const longerActivities = activities.filter(act => act.minutes > 30);
const mostCaloric = activities.reduce((max, act) => act.calories > max.calories ? act : max, activities[0]);

console.log(`Łączny czas aktywności: ${totalMinutes} min`);
console.log(`Spalone kalorie: ${totalCalories} kcal`);
console.log(`Aktywności trwające ponad 30 minut: ${longerActivities.map(a => a.type).join(', ')}`);
console.log(`Najwięcej kalorii spala: ${mostCaloric.type} (${mostCaloric.calories} kcal)`);


printSection('Zadanie 11 - Podział kosztów wyjazdu');

const tripCosts = [
  { label: 'nocleg', amount: 420, paidBy: 'Anna' },
  { label: 'paliwo', amount: 260, paidBy: 'Piotr' },
  { label: 'jedzenie', amount: 180, paidBy: 'Anna' },
  { label: 'bilety', amount: 140, paidBy: 'Ola' }
];

const totalTripCost = tripCosts.reduce((sum, cost) => sum + cost.amount, 0);

const expensesPerPerson = tripCosts.reduce((acc, cost) => {
  if (!acc[cost.paidBy]) acc[cost.paidBy] = 0;
  acc[cost.paidBy] += cost.amount;
  return acc;
}, {});

const topPayer = Object.entries(expensesPerPerson).reduce((max, curr) => curr[1] > max[1] ? curr : max);
const numberOfPeople = Object.keys(expensesPerPerson).length;
const averageCostPerPerson = totalTripCost / numberOfPeople;

console.log(`Całkowity koszt wyjazdu: ${totalTripCost} zł`);
console.log('Wydatki poszczególnych osób:', expensesPerPerson);
console.log(`Najwięcej zapłacił(a): ${topPayer[0]} (${topPayer[1]} zł)`);

console.log('Rozliczenie:');
for (const [person, paid] of Object.entries(expensesPerPerson)) {
  const diff = paid - averageCostPerPerson;
  if (diff > 0) {
    console.log(`- ${person} powinien/powinna otrzymać: ${diff.toFixed(2)} zł`);
  } else if (diff < 0) {
    console.log(`- ${person} musi oddać: ${Math.abs(diff).toFixed(2)} zł`);
  } else {
    console.log(`- ${person} jest rozliczony/a na zero.`);
  }
}


printSection('Zadanie 12 - Wyszukiwarka kontaktów');

const contacts = [
  { name: 'Anna Nowak', phone: '500-100-200', city: 'Katowice', favorite: true },
  { name: 'Piotr Lis', phone: '501-300-700', city: 'Sosnowiec', favorite: false },
  { name: 'Ola Marek', phone: '502-400-900', city: 'Katowice', favorite: true }
];

const getContactsByCity = city => contacts.filter(c => c.city === city);
const getFavoriteContacts = () => contacts.filter(c => c.favorite);
const getContactsByNameMatch = query => contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
const formatContacts = contactList => contactList.map(c => `${c.name} — ${c.phone}`);

console.log('Kontakty z Katowic:');
formatContacts(getContactsByCity('Katowice')).forEach(c => console.log(`- ${c}`));

console.log('Ulubione kontakty:');
formatContacts(getFavoriteContacts()).forEach(c => console.log(`- ${c}`));

console.log('Wyszukiwanie po fragmencie "Nowa":');
formatContacts(getContactsByNameMatch('Nowa')).forEach(c => console.log(`- ${c}`));


printSection('Zadanie 13 - Pobieranie danych o pogodzie z API');

async function fetchWeather(lat = 50.29, lon = 19.10) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd HTTP! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Pogoda dla współrzędnych (${lat}, ${lon}):`);
    console.log(`- Temperatura: ${data.current.temperature_2m}${data.current_units.temperature_2m}`);
    console.log(`- Prędkość wiatru: ${data.current.wind_speed_10m}${data.current_units.wind_speed_10m}`);
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania danych z API:', error.message);
  }
}

fetchWeather();
// Dodatkowe wywołanie dla innej lokalizacji
fetchWeather(52.2297, 21.0122);


printSection('Zadanie 14 - Lista zadań „to do” z obsługą statusu');

let todos = [
  { id: 1, title: 'Oddać projekt', done: false },
  { id: 2, title: 'Przeczytać rozdział', done: true },
  { id: 3, title: 'Przygotować prezentację', done: false }
];

const addTodo = (todoList, title) => [
  ...todoList, 
  { id: todoList.length ? Math.max(...todoList.map(t => t.id)) + 1 : 1, title, done: false }
];

const markAsDone = (todoList, id) => todoList.map(t => t.id === id ? { ...t, done: true } : t);

const getPendingTodos = todoList => todoList.filter(t => !t.done);

const updatedWithNew = addTodo(todos, 'Zrobić zadanie 15');
const updatedWithDone = markAsDone(updatedWithNew, 1);
const pendingTodos = getPendingTodos(updatedWithDone);
const remainingCount = pendingTodos.length;

console.log('Pełna lista po zmianach:');
updatedWithDone.forEach(t => console.log(`- [${t.done ? 'x' : ' '}] ${t.title}`));

console.log('Niewykonane zadania:');
pendingTodos.forEach(t => console.log(`- ${t.title}`));
console.log(`Pozostało do zrobienia: ${remainingCount}`);


printSection('Zadanie 15 - Prosty planer zajęć');

const schedule = [
  { day: 'poniedziałek', subject: 'Programowanie', room: 'A12', online: false },
  { day: 'wtorek', subject: 'Bazy danych', room: 'online', online: true },
  { day: 'czwartek', subject: 'Grafika', room: 'B03', online: false },
  { day: 'piątek', subject: 'UX', room: 'online', online: true }
];

const getScheduleForDay = day => schedule.filter(s => s.day === day);
const getOnlineClasses = () => schedule.filter(s => s.online);
const formatSchedule = items => items.map(s => `${s.subject} — ${s.room} — ${s.online ? '[online]' : '[stacjonarnie]'}`);

const totalClasses = schedule.length;
const tuesdayClasses = getScheduleForDay('wtorek');
const onlineClasses = getOnlineClasses();

console.log('Wszystkie zajęcia w tygodniu:', totalClasses);

console.log('Zajęcia we wtorek:');
formatSchedule(tuesdayClasses).forEach(c => console.log(`- ${c}`));

console.log('Wszystkie zajęcia online:');
formatSchedule(onlineClasses).forEach(c => console.log(`- ${c}`));

