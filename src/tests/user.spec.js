import { expect } from 'chai';

import * as userApi from './api'

describe('users', () => {
    describe('user(id: String!): User', () => {
        it('returns a user when user can be found', async () => {
            const expectedResult = {
                data: {
                    user: {
                        id: '1',
                        username: 'k-fang',
                        email: 'k-fang@yahoo.co.jp',
                        role: 'ADMIN',
                    },
                },
            };

            const result = await userApi.user({ id: '1' });

            expect(result.data).to.eql(expectedResult);
        });
        it('returns null when user cannot be found', async () => {
            const expectedResult = {
                data: {
                    user: null
                }
            }
            const result = await userApi.user({ id: '42' })

            expect(result.data).to.eql(expectedResult)
        })
    });
    describe('deleteUser(id: String!): Boolean!', () => {
        it('returns an error because only admins can delete a user', async () => {
            const {
                data: {
                    data: {
                        signIn: { token }
                    }
                }
            } = await userApi.signIn({
                login: 'alice',
                password: 'alicepass'
            })

            const {
                data: { errors }
            } = await userApi.deleteUser({ id: '2' }, token)

            expect(errors[0].message).to.eql('Not authorized as admin.')
        })
    })
    describe('deleteUser(id: String!): Boolean!', () => {
        it('returns true of deleteUser ', async () => {
            const {
                data: {
                    data: {
                        signIn: { token }
                    }
                }
            } = await userApi.signIn({
                    login: 'k-fang',
                    password: '1234qwer'
                })

            const {
                data: { data }
            } = await userApi.deleteUser({ id: '2' }, token)

            expect(data.deleteUser).to.eql(true)
        })
    })
})