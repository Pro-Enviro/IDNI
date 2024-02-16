export class Columns {
  name!: string;
  type!: string;
  draggable?: boolean;
  math?: boolean = false;
  selectedMath?: string | undefined;
  checked?: boolean;
  operator?: string;
  option1?: string;
  option2?: string;
  prefix? :string;
  suffix?: string;
  total?: boolean;
}

export class BaseColumns {
  cols: Columns[] = []
}

export class ElectricityRequired {
  type: string = 'Electricity'
  customConversionFactor?: string = ''
  cols: Columns[] = [{
    name: 'Start Date',
    type: 'date',
    math: false,
  }, {
    name: 'End Date',
    type: 'date',
    math: false,
  }, {
    name: 'Days',
    type: 'number',
    total: false,
    math: false,
  }, {
    name: 'Value',
    type: 'number',
    total: false,
    suffix: 'kWh',
    math: true,
    draggable: true,
    checked: false,
    selectedMath:'times',
  }, {
    name: 'A/E',
    type: 'text',
    math: false,
  }, {
    name: 'Unit',
    type: 'uom',
    math: false,
  }, {
    name: 'Cost',
    type: 'number',
    total: false,
    math: true,
    draggable: true,
    checked: false,
    prefix: '£',
    selectedMath:'times',
  }, {
    name: 'Standing Rate',
    type: 'number',
    total: false,
    draggable: true,
    checked: false,
    math: true,
    selectedMath: 'times',
    option1: 'Days',
    option2: 'Value',
    prefix: '£'
  }, {
    name: 'Standing Charge',
    type: 'number',
    total: false,
    draggable: true,
    checked: false,
    math: true,
    option1: '',
    option2: '',
    prefix: '£'
  }, {
    name: 'CCL Rate',
    type: 'number',
    total: false,
    draggable: true,
    checked: false,
    math: true,
    option1: '',
    option2: '',
    prefix: '£'
  }, {
    name: 'CCL Cost',
    type: 'number',
    total: false,
    draggable: true,
    checked: false,
    math: true,
    option1: '',
    option2: '',
    prefix: '£'
  }, {
    name: 'Total',
    type: 'number',
    total: false,
    math: false,
    prefix: '£'
  }]
}

export class OptionalElectric {
  cols?: Columns[] = [
    {
      name: 'Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: false,
      prefix: '£'
    }, {
      name: 'Day Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
      checked: false,
      option1: '',
      option2: '',
      prefix: '£'
    }, {
      name: 'Day kwh',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
      checked: false,
      option1: '',
      option2: ''
    }, {
      name: 'Day cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
      checked: false,
      option1: '',
      option2: '',
      prefix: '£'
    }, {
      name: 'Night Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
      checked: false,
      option1: '',
      option2: '',
      prefix: '£'
    }, {
      name: 'Night kwh',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
      checked: false,
      option1: '',
      option2: ''
    }, {
      name: 'Night cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
      checked: false,
      option1: '',
      option2: '',
      prefix: '£'
    }]
}


export class GasRequired {
  type: string = 'Gas'
  cols: Columns[] = [
    {
      name: 'Start Date',
      type: 'date',
      math: false,
    }, {
      name: 'End Date',
      type: 'date',
      math: false,
    }, {
      name: 'Days',
      type: 'number',
      total: false,
      math: false,
    }, {
      name: 'Value',
      suffix: 'kWh',
      type: 'number',
      total: false,
      math: true,
      draggable: false,
      checked: false,
      selectedMath:'times',
    }, {
      name: 'A/E',
      type: 'text',
      math: false,
    }, {
      name: 'Unit',
      type: 'uom',
      math: false,
    }, {
      name: 'Rate',
      type: 'number',
      total: false,
      math: false,
    }, {
      name: 'Cost',
      type: 'number',
      total: false,
      math: true,
      draggable: true,
      checked: false,
      prefix: '£',
      selectedMath:'times',
    }, {
      name: 'Standing Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Standing Charge',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'CCL Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'CCL Cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Total',
      type: 'number',
      total: false,
      math: false,
    }]
}

export class GasOptional {
  cols?: Columns[] = [{
    name: 'Day Rate',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Day kwh',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Day cost',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Night Rate',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Night kwh',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Night cost',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }]
}


export class PropaneRequired {
  type: string = 'Propane'
  cols: Columns[] = [
    {
      name: 'Start Date',
      type: 'date',
      math: false,
    }, {
      name: 'End Date',
      type: 'date',
      math: false,
    }, {
      name: 'Days',
      type: 'number',
      total: false,
      math: false,
    }, {
      name: 'Value',
      type: 'number',
      total: false,
      suffix: 'kWh',
      math: true,
      draggable: false,
      checked: false,
      selectedMath:'times',
    }, {
      name: 'A/E',
      type: 'text',
      math: false,
    }, {
      name: 'Unit',
      type: 'uom',
      math: false,
    }, {
      name: 'Rate',
      type: 'number',
      total: false,
      math: false,
    }, {
      name: 'Cost',
      type: 'number',
      total: false,
      math: true,
      draggable: true,
      checked: false,
      prefix: '£',
      selectedMath:'times',
    }, {
      name: 'Standing Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Standing Charge',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'CCL Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'CCL Cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Total',
      type: 'number',
      total: false,
      math: false,
    }]
}

export class PropaneOptional {
  cols?: Columns[] = [{
    name: 'Day Rate',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Day kwh',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Day cost',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Night Rate',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Night kwh',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }, {
    name: 'Night cost',
    type: 'number',
    total: false,
    draggable: true,
    math: true,
  }]
}



export class GenericRequired {
  type: string = ''
  cols: Columns[] = [
    {
      name: 'Start Date',
      type: 'date',
      math: false,
    }, {
      name: 'End Date',
      type: 'date',
      math: false,
    }, {
      name: 'Days',
      type: 'number',
      total: false,
      math: false,
    }, {
      name: 'Value',
      type: 'number',
      total: false,
      suffix: 'kWh',
      math: true,
      draggable: false,
      checked: false,
      selectedMath:'times',
    }, {
      name: 'A/E',
      type: 'text',
      math: false,
    }, {
      name: 'Unit',
      type: 'uom',
      math: false,
    }, {
      name: 'Rate',
      type: 'number',
      total: false,
      math: false,
    }, {
      name: 'Cost',
      type: 'number',
      total: false,
      math: true,
      draggable: true,
      checked: false,
      prefix: '£',
      selectedMath:'times',
    }, {
      name: 'Standing Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Standing Charge',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Total',
      type: 'number',
      total: false,
      math: false,
    }]
}

export class GenericOptional {
  cols?: Columns[] = [
    {
      name: 'CCL Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'CCL Cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Total',
      type: 'number',
      total: false,
      math: false,
    },
    {
      name: 'Day Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Day kwh',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Day cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Night Rate',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Night kwh',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }, {
      name: 'Night cost',
      type: 'number',
      total: false,
      draggable: true,
      math: true,
    }]
}

