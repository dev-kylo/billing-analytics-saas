const knex = require('../config/db');

exports.createRecognitionEntries = async (entries) => knex('revenue_recognition').insert(entries).returning('*');

exports.getBySubscription = (subscriptionId, filters = {}) => {
    const query = knex('revenue_recognition').where('subscription_id', subscriptionId);

    if (filters.status) query.andWhere('status', filters.status);
    if (filters.start) query.andWhere('recognition_start_date', '>=', filters.start);
    if (filters.end) query.andWhere('recognition_end_date', '<=', filters.end);

    return query.orderBy('recognition_start_date', 'asc');
};

exports.getSubscriptionSummary = async (subscriptionId, filters = {}) => {
    // SELECT
    //   status,
    //   SUM(amount) AS total
    // FROM
    //   revenue_recognition
    // WHERE
    //   subscription_id = $1
    //   AND (recognition_start_date >= $2 OR $2 IS NULL)
    //   AND (recognition_end_date <= $3 OR $3 IS NULL)
    // GROUP BY
    //   status;

    const query = knex('revenue_recognition')
        .where('subscription_id', subscriptionId)
        .select('status')
        .sum('amount as total')
        .groupBy('status');

    if (filters.start) query.andWhere('recognition_start_date', '>=', filters.start);
    if (filters.end) query.andWhere('recognition_end_date', '<=', filters.end);

    const rows = await query;

    const summary = { recognized: 0, pending: 0 };
    for (const row of rows) {
        if (row.status === 'recognized') summary.recognized = parseFloat(row.total);
        if (row.status === 'pending') summary.pending = parseFloat(row.total);
    }
    summary.total = summary.recognized + summary.pending;
    return summary;
};
