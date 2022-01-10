import NextAuth from 'next-auth';
import Providers from 'next-auth/providers'
import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna'

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_KEY,
            scope: 'user:email, read:user'
        }),
        
    ],

    /*jwt: {
        signingKey: process.env.SIGNIN_KEY,
    },*/

    callbacks: {
        signIn: async (user, account) => {
            if (account.provider === 'github') {
                const res = await fetch('https://api.github.com/user/emails', {
                    headers: { Authorization: `token ${account.accessToken}` },
                })
                const emails = await res.json()
                if (emails?.length > 0) {
                    user.email = emails.sort((a, b) => b.primary - a.primary)[0].email

                }

            }

            try {
                const { email } = user
                await fauna.query(
                   q.If(
                       q.Not(
                           q.Exists(
                               q.Match(
                                   q.Index('user_by_email'),
                                   q.Casefold(user.email)
                               )
                           )
                       ),
                       q.Create(
                           q.Collection('users'),
                           { data: { email }}
                       ),
                       q.Get(
                           q.Match(
                               q.Index('user_by_email'),
                               q.Casefold(user.email)
                           )
                       )
                   )
                )

                return true
            } catch(e){
                return false
            }



        }


    },


})