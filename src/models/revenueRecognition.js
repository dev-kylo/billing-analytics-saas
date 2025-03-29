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

// UPDATE revenue_recognition rr
// SET status = 'recognized',
//     recognized_at = NOW()
// FROM subscriptions s
// WHERE rr.subscription_id = s.id
//   AND rr.status = 'pending'
//   AND rr.recognition_start_date <= CURRENT_DATE
//   AND CURRENT_DATE BETWEEN s.start_date AND s.end_date;

exports.updateRecognitionStatus = async () =>
    knex('revenue_recognition as rr')
        .update({
            status: 'recognized',
            recognized_at: knex.fn.now(),
        })
        .where('rr.status', 'pending')
        .andWhere('rr.recognition_start_date', '<=', knex.fn.now())
        .whereExists(function () {
            this.select('*')
                .from('subscriptions as s')
                .whereRaw('s.id = rr.subscription_id')
                .andWhere('s.start_date', '<=', knex.fn.now())
                .andWhere('s.end_date', '>=', knex.fn.now());
        });
