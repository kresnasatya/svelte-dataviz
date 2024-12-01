import { autoType, csv, extent, groups } from 'd3';

const dataPath = 'https://raw.githubusercontent.com/higsch/data/main/daily_surface_temperatures/daily_surface_temperatures.csv';

class Data {
    data = $state([]);
    constructor() {
        // run once when array is created
        csv(dataPath, autoType).then((d) => {
            this.data = d;
        });
    }

    // derived state
    dataByYear = $derived.by(() => {
        return groups(this.data, d => d.year).map(([key, values]) => {
            const filteredValues = values.filter(d => d.value !== 'NA');
            return {
                key,
                values: filteredValues
            }
        });
    });

    dayOfYearDomain = $derived.by(() => {
        return extent(this.data, d => d.day_of_year);
    });

    valueDomain = $derived.by(() => {
        return extent(this.data, d => d.value);
    });
}

export let data = new Data();
