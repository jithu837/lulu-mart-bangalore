// Seed data for the Lulu Mart Bangalore ice cream counter.
// Names, descriptions and images are adapted from Ibaco's own product
// pages. Ibaco does not publish prices online, so every price below is
// a TYPICAL MART ESTIMATE for demo purposes only.

const IMG_FLAVOUR = 'https://www.ibaco.in/assets/img/sundaes/'
const IMG_CAKE = 'https://www.ibaco.in/assets/img/cakes/'
const CHOC_IMG = 'https://www.ibaco.in/assets/img/chocolates/'
const BREW_IMG = 'https://www.ibaco.in/assets/img/coldbrew/'

const FLAVOURS = [
  ['Avocado Honey', 'Avacodo-Honey.png', 'A surprising pairing of avocado and honey for an adventurous scoop.'],
  ['Bubblegum', 'IBACO---Bubblegum.png', 'A nostalgic bubblegum flavour with a hint of strawberry jelly.'],
  ['Cotton Candy', 'IBACO---Cotton-Candy.png', 'The fairground favourite, reimagined as a creamy scoop.'],
  ['Coffee Caramel', 'IBACO-WEBSITE-Coffee-caramel.png', 'Coffee-infused caramel for a rich, roasted finish.'],
  ['Tiramisu', 'tiramisu-2.png', 'Coffee and mascarpone notes inspired by the classic Italian dessert.'],
  ['Peach & Strawberry', 'Ibaco-Icecream-Peach-Strawberry-Duet-New.png', 'Peach chunks meet strawberry sauce in this fruity duet.'],
  ['Tender Coconut', 'IBACO-NEW-SCOOPES-WEB-COCONUT.png', 'A creamy scoop built around fresh coconut flavour.'],
  ['Bean Vanilla', 'Image-1.png', 'Natural vanilla ice cream finished with real vanilla bean powder.'],
  ['Strawberry', 'Strawberry.png', 'Strawberry ice cream layered with a fruit crush.'],
  ['Dark Chocolate', 'Image-3.png', 'Chocolate ice cream studded with chocolate buttons.'],
  ['Pistachio', 'Image-4.png', 'Pistachio ice cream finished with whole pistachio nuts.'],
  ['Almond Crunch', 'Image-5.png', 'Vanilla ice cream with almonds coated in chocolate and honey sauce.'],
  ['Blueberry Cheesecake', 'Image-6.png', 'A blueberry and cheesecake-inspired combination.'],
  ['Butterscotch', 'Image-8.png', 'Butterscotch ice cream with cashew and walnut praline.'],
  ['Sea Salt Caramel Pecan', 'Image-10.png', 'Salted caramel balanced with roasted pecans.'],
  ['Cream N Cookies', 'Image-12.png', 'Vanilla ice cream mixed with toffee and malt granules.'],
  ['Vanilla Choco Chips', 'Image-13.png', 'Vanilla ice cream with chocolate buttons and chocolate fudge.'],
  ['Swiss Chocolate', 'Image-15.png', 'A rich chocolate flavour in the Swiss style.'],
  ['Alphonso Mango', 'Image-16.png', 'Mango ice cream with real Alphonso mango chunks.'],
  ['Italian Wonder', 'Italian-Wonder.png', 'Vanilla ice cream with cashew, raisins and three fruit sauces.'],
  ['Belgian Chocolate', 'Image-19.png', 'An ice cream built on Belgian-style cocoa.'],
  ['Nuts & Saffron', 'Image-20.png', 'Saffron ice cream with basundi, cardamom and mixed nuts.'],
  ['Vanilla Choco Berry', 'Image-21.png', 'Vanilla, chocolate and berry brought together in one scoop.'],
  ['Chocolate Overload', 'Image-23.png', 'An intensely rich, all-chocolate flavour.'],
  ['Blackcurrant', 'Image-26.png', 'Blackcurrant ice cream with dried blackcurrant fruit.'],
  ['Mocha Fudge', 'Image-27.png', 'A mocha and fudge combination for coffee lovers.'],
  ['Jackfruit', 'Image-30.png', 'Ice cream made with real jackfruit pulp.'],
  ['Fig & Honey', 'Image-32.png', 'Honey ice cream finished with a fig fruit crush.'],
  ['Fruit Bonanza', 'Image-33.png', 'Vanilla ice cream loaded with fig, blackcurrant, pineapple, raisin, cashew and tutty-fruity.'],
]

const CAKES = [
  ['Choco Cookie Teddy Bear', '10 Serve', 'Bear-Cake.png', 'Belgian chocolate and cream-n-cookie ice cream finished with choco fudge.', 999],
  ['Happy Berry Pond', '6 Serve', 'Kids-Cake.png', 'Strawberry ice cream paired with vanilla choco berry ice cream.', 699],
  ['Chocolate Overload Cake', '6 Serve', 'cake1.png', 'A chocolate cake base layered with chocolate ice cream, flakes and almonds.', 749],
  ['Fruit and Blackcurrant Drizzle', '6 Serve', 'Fruit-and-Blackcurrant.png', 'Blackcurrant and vanilla fruit bonanza ice cream with assorted nuts.', 729],
  ['Mango Italian Fiesta', '6 Serve', 'Mango-Italian-Fiesta-cake.png', 'Mango ice cream paired with vanilla Italian Wonder ice cream and nuts.', 769],
  ['Swiss Choco Symphony', '6 Serve', 'swiss-choco-cake.png', 'Swiss chocolate and white chocolate ice cream coated in chocolate chips.', 789],
  ['Pistachio Almond Ecstasy', '6 Serve', 'cake_pistachio.png', 'Dulce-de-leche cream layered with pistachio and almond crunch ice cream.', 849],
  ['Black Forest', '10 Serve', 'cake8.png', 'Black Forest and white choco raspberry ice cream over a Black Forest cake base, finished with cherries and chocolate flakes.', 1049],
  ['Blackcurrant Rich Cream', '10 Serve', 'Blackcurrant.png', 'Blackcurrant and blackberry ice cream with cranberries and dried blackcurrant.', 999],
  ['Butterscotch Almond Amore', '10 Serve', 'cake7.png', 'Butter and vanilla almond crunch ice cream with almonds and white chocolate shavings.', 1029],
  ['Mango Kingdom Gala', '20 Serve', 'cake9.png', 'Mango Kingdom ice cream finished with white chocolate shavings.', 1899],
  ['Dessert Royale', 'Mini Edition', 'Dessert-Royale-Desk.png', 'A saffron-based ice cream topped with nuts and white chocolate flakes.', 349],
]

const CHOCOLATES = [
  ['Dark Chocolate Fantasy', '7A.png', 'Ganache', 'A rich dark chocolate ganache piece.'],
  ['Milk Ganache Twist', '7C.png', 'Ganache', 'A smooth milk chocolate ganache piece.'],
  ['Milk Ganache Secrets', '7D.png', 'Ganache', 'A creamy milk ganache filled chocolate.'],
  ['Almond Marzipan Breeze', '8B.png', 'Marzipan', 'Almond marzipan wrapped in chocolate.'],
  ['Cashew Marzipan Discoveries', '8C.png', 'Marzipan', 'Cashew marzipan wrapped in chocolate.'],
  ['Almond Marzipan Surprise', '8D.png', 'Marzipan', 'A surprise almond marzipan chocolate.'],
  ['Strawberry Burst', 'STRAWBERRY-LUST.png', 'Puree', 'A strawberry fruit puree filled chocolate.'],
  ['Mango Choco Fusion', '9C.png', 'Puree', 'Mango puree fused into milk chocolate.'],
  ['Black Currant Exotica', '9D.png', 'Puree', 'Blackcurrant puree filled chocolate.'],
  ['Blackcurrant Cranberry Lush', 'BLACKCURRANR-CRANBERRY-LUSH.png', 'Nuts & Fruits', 'Blackcurrant and cranberry with a nutty finish.'],
  ['Almond Cashew Crunch', 'ALMOND-CASHEW-CRUNCH.png', 'Nuts & Fruits', 'A crunchy almond and cashew chocolate.'],
  ['Almond Cranberry Epic', 'ALMOND-CRANBERRY-EPIC.png', 'Nuts & Fruits', 'Almond and cranberry in a chocolate shell.'],
  ['Classic Milk Chocolate Bar', 'Milk-Chocolate-final.png', 'Bar Chocolates', 'A simple, classic milk chocolate bar.'],
  ['Classic Dark Chocolate Bar', 'Dark-Chocolate-final.png', 'Bar Chocolates', 'A simple, classic dark chocolate bar.'],
  ['Blackcurrant Pistachio & Cashew Bar', 'BLACKCURRANT-PISTACHIO%26CASHEW-Milk-Chocolate.png', 'Bar Chocolates', 'Milk chocolate bar with blackcurrant, pistachio and cashew.'],
  ['Almond & Cashew Bar', 'ALMOND-CASHEW-Milk-Chocolate.png', 'Bar Chocolates', 'Milk chocolate bar with almond and cashew.'],
  ['Hazelnut Cranberry & Cashew Bar', 'HAZELNUT-CRANBERRY%26CASHEW-Dark-Chocolate.png', 'Bar Chocolates', 'Dark chocolate bar with hazelnut, cranberry and cashew.'],
  ['Cranberry & Blackcurrant Bar', 'CRANBERRY-BLACKCURRANT-Milk-Chocolate.png', 'Bar Chocolates', 'Milk chocolate bar with cranberry and blackcurrant.'],
  ['Cranberry Almond & Cashew Bar', 'CRANBERRY-ALMOND%26CASHEW-Dark-Chocolate.png', 'Bar Chocolates', 'Dark chocolate bar with cranberry, almond and cashew.'],
  ['Caramelized Almond & Hazelnut Bar', 'almond-%26-hazelnut.png', 'Bar Chocolates', 'Milk chocolate bar with caramelized almond and hazelnut.'],
  ['Caramelized Pecan & Fig Bar', 'pecan-%26-fig.png', 'Bar Chocolates', 'Dark chocolate bar with caramelized pecan and fig.'],
  ['Orange Mist', 'Chocolate-Orange-Mist.png', 'Others', 'Milk chocolate with a rich orange cream centre.'],
  ['Cappuccino Clues', 'Chocolate-Cappucino.png', 'Others', 'Milk chocolate filled with a cappuccino cream centre.'],
  ['Milk Chocolate', 'Image-1.png', 'Others', 'A plain milk chocolate piece.'],
  ['Dark Chocolate', 'Image-2.png', 'Others', 'A plain dark chocolate piece.'],
  ['Milk Chocolate Waffle Crisps', 'Image-3.png', 'Others', 'Milk chocolate with crunchy waffle crisp pieces.'],
  ['Dark Chocolate Waffle Crisps', 'Image-4.png', 'Others', 'Dark chocolate with crunchy waffle crisp pieces.'],
  ['Hazelnut Barks', 'Image-5.png', 'Others', 'A bark-style chocolate studded with hazelnuts.'],
]

const COLD_BREWS = [
  ['Coffee Cold Brew', 'coldbrew-coffee-new.png', 'A classic cold brew coffee with a twist.'],
  ['Mocha Cold Brew', 'coldbrew-mocha-new.png', 'Coffee and chocolate combined in a cold brew.'],
  ['Matcha Tea Cold Brew', 'coldbrew-green.png', 'A refreshing green matcha tea cold brew.'],
]

const PREMIUM_HINTS = ['Pistachio', 'Saffron', 'Almond', 'Caramel', 'Cheesecake', 'Tiramisu', 'Avocado']
function estimatePrice(name, index) {
  const base = 79 + (index % 5) * 10
  const premium = PREMIUM_HINTS.some((w) => name.includes(w)) ? 30 : 0
  return base + premium
}

export function buildSeedProducts() {
  const iceCreams = FLAVOURS.map(([name, file, desc], i) => ({
    name,
    category: 'Ice Cream',
    unit: '125 ml cup',
    description: desc,
    image: IMG_FLAVOUR + file,
    price: estimatePrice(name, i),
    isEstimate: true,
  }))

  const cakes = CAKES.map(([name, serves, file, desc, price]) => ({
    name,
    category: 'Ice Cream Cake',
    serves,
    description: desc,
    image: IMG_CAKE + file,
    price,
    isEstimate: true,
  }))

  const chocolates = CHOCOLATES.map(([name, file, group, desc], i) => ({
    name,
    category: 'Chocolate',
    group,
    description: desc,
    image: CHOC_IMG + file,
    price: 89 + (i % 6) * 15,
    isEstimate: true,
  }))

  const coldBrews = COLD_BREWS.map(([name, file, desc], i) => ({
    name,
    category: 'Cold Brew',
    description: desc,
    image: BREW_IMG + file,
    price: 129 + i * 10,
    isEstimate: true,
  }))

  return [...iceCreams, ...cakes, ...chocolates, ...coldBrews]
}
