import { SetMetadata } from '@nestjs/common'

export const Auth = (auth: string) => SetMetadata('Auth', auth)
