

exports.login = async (username, password) => {
    const user = await db('users')
        .where({ username, password })
        .first();

    return user;
};

exports.register = async (username, password) => {
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const user = await db('users')
        .insert({ username, password: hash })
        .returning('*');
    return user;
};