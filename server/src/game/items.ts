import ScavengerItem from "./ScavengerItem";

export const itemList: ScavengerItem[] = [];

// possible items
itemList.push(
    {
        name: 'Chair',
        points: 1,
        tags: ['chair', 'office chair', 'seat']
    },
    /*{
        name: 'Table',
        points: 1,
        tags: ['table', 'desk']
    },*/

    {
        name: 'Computer',
        points: 1,
        tags: ['computer keyboard', 'laptop', 'monitor', 'computer screen']
    },

    {
        name: 'Bottle',
        points: 1,
        tags: ['bottle', 'water bottle', 'plastic bottle', 'cup',]
    },
    /*{
        name: 'Phone',
        points: 1,
        tags: ['mobile phone', 'phone', 'iphone', 'smartphone']

    },
    {
        name: 'Keyboard',
        points: 1,
        tags: ['keyboard', 'computer keyboard']

    },
    {
      name: 'Mouse',
      points: 1,
      tags: ['mouse', 'computer mouse']
    },*/
    {
      name: 'Glasses',
      points: 1,
      tags: ['glasses', 'sunglasses', 'eyewear']
    },
    {
      name: 'Backpack',
      points: 1,
      tags: ['bag', 'backpack', 'baggage']
    }
    /*{
      name: 'Soda Can',
      points: 1,
      tags: ['tin can', 'aluminum can', 'beverage can', 'soda can']
    }*/
)
