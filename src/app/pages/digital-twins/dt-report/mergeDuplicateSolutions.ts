import Fuse from "fuse.js";

const FUSE_OPTIONS = {
  recommendation: {
    threshold: 0.2,
    ignoreLocation: true,
    includeScore: true,
    keys: ['recommendation']
  },
  digitalTwin: {
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    keys: ['solutionText']
  }
}

const PROPERTIES_TO_MERGE = ['estimatedEnergySaving',
  'estimatedCarbonSaving',
  'estimatedCost',
  'estimatedSaving',]

// Implement fuzzy matching for recommendations and Digital Twin solutions
export function mergeDuplicateSolutions(items: any, type = 'recommendation') {
  if (!items?.length) return []

  const workingSet = [...items];
  // Select the correct fuse options from above depending on recommendation/digital twin
  const fuseOptions = type === 'digitalTwin' ? FUSE_OPTIONS.digitalTwin : FUSE_OPTIONS.recommendation
  const fuse = new Fuse(workingSet, fuseOptions);

  // Using a set to prevent skipping over duplicates
  const processedIds = new Set();
  const mergedItems: any[] = [];

  workingSet.forEach((item, index: number) => {
    if (processedIds.has(index)) return;
    const searchKey = type === 'digitalTwin' ? item.solutionText : item.recommendation

    if (!searchKey) return;

    const searchResults = fuse.search(searchKey);

    //
    const duplicates = searchResults.filter((result: any) => {
      const resultIndex = workingSet.indexOf(result.item);
      return resultIndex !== index && !processedIds.has(resultIndex)
    }).map(result => ({
      item: result.item,
      index: workingSet.indexOf(result.item)
    }))

    // Build a merged item array, duplicates become one object with a counter.
    if (duplicates.length > 0) {
      const mergedItem = mergeDuplicateItem(item, duplicates.map(d => d.item));
      duplicates.forEach(duplicate => processedIds.add(duplicate.index));
      mergedItems.push(mergedItem);
    } else if (!processedIds.has(index)) {
      mergedItems.push({...item})
    }

    processedIds.add(index);
  })

  return mergedItems;
}


function mergeDuplicateItem(original: any, duplicates: any) {
  const merged = {...original}
  let paybackSum = merged.paybackPeriod || 0;
  let paybackCount = merged.paybackPeriod ? 1 : 0;
  merged.counter = 1;

  duplicates.forEach((duplicate: any) => {
    merged.counter = (merged.counter || 1) + 1;

    // Handle payback
    if (duplicate?.paybackPeriod != null) {
      paybackSum += duplicate.paybackPeriod;
      paybackCount++;
    }

    // Sum all required properties
    PROPERTIES_TO_MERGE.forEach((prop: any) => {
      if (duplicate[prop] != null) {
        merged[prop] = (merged[prop] || 0) + duplicate[prop];
      }
    })
  })
  // Calculate average payback
  if (paybackCount > 0) {
    merged.paybackPeriod = paybackSum / paybackCount;
  }


  return merged;
}

// sumProperties = (item1: any, item2: any) => {
//   item1.estimatedEnergySaving += item2?.estimatedEnergySaving || 0;
//   item1.estimatedCarbonSaving += item2?.estimatedCarbonSaving || 0;
//   item1.estimatedCost += item2?.estimatedCost || 0;
//   item1.estimatedSaving += item2?.estimatedSaving || 0;
// }
