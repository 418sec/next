require('../../src/base');

describe('src/base-map', function() {
  test('nx.map-array', function() {
    var arr = [1, 2, 3];
    var result = nx.map(arr, function(index, item) {
      return item * 2;
    });

    expect(result).toEqual([2, 4, 6]);
  });

  test('nx.map-object', function() {
    var obj = { name: 'fei', email: '1290657123@qq.com', nx: 'next' };
    var keys = nx.map(obj, function(key, value) {
      return key;
    });
    var values = nx.map(obj, function(key, value) {
      return value;
    });

    expect(keys).toEqual(['name', 'email', 'nx']);
    expect(values).toEqual(['fei', '1290657123@qq.com', 'next']);
  });

  test('nx.map-object change context', function() {
    var obj = { name: 'fei', email: '1290657123@qq.com', nx: 'next' };
    var ctx1 = { g1: 'global-value' };
    var keys = nx.map(obj, function(key, value) {
      return key;
    });
    var values = nx.map(
      obj,
      function(key, value) {
        return value + '_' + this.g1;
      },
      ctx1
    );

    expect(keys).toEqual(['name', 'email', 'nx']);
    expect(values).toEqual([
      'fei_global-value',
      '1290657123@qq.com_global-value',
      'next_global-value'
    ]);
  });
});
