import ScavengerItem from "./ScavengerItem";

export const itemList: ScavengerItem[] = [];

// possible items
itemList.push(
    {
        name: 'Chair',
        points: 1,
        tags: ['chair']
    },
    {
        name: 'Table',
        points: 1,
        tags: ['table', 'desk']
    },
    {
        name: 'Computer',
        points: 1,
        tags: ['computer', 'laptop', 'monitor', 'screen']
    }
)