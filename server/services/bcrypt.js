import bcrypt from 'bcryptjs';
import config from 'config';

export default {
    hash: async (string) => (
        new Promise((resolve, reject) => {
            bcrypt.genSalt(config.bcrypt.saltRounds, (error, salt) => {
                if (error) {
                    return reject(error);
                }

                return bcrypt.hash(
                    string,
                    salt,
                    (error2, hash) => {
                        if (error2) {
                            return reject(error2);
                        }

                        return resolve(hash);
                    },
                );
            });
        })
    ),

    compare: async (string, hash) => (
        new Promise((resolve, reject) => {
            bcrypt.compare(
                string,
                hash,
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                },
            );
        })
    ),
};
