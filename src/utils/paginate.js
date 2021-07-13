const paginate = async function (filter, options = { sortBy: '', limit: 10, page: 1 }) {
  let order = [];
  if (options.sortBy) {
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      order.push([key, order.toUpperCase()]);
    });
  } else {
    order.push(['createdAt', 'ASC']);
  }

  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const offset = (page - 1) * limit;

  const countPromise = this.count({ where: { ...filter } });
  const docsPromise = this.findAll({ where: { ...filter }, offset, limit, order });

  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalResults, results] = values;
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};

module.exports = paginate;
