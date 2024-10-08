/* Copyright 2024 Prokhor Kalinin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtGuard class provides an authentication guard that verifies the
 * presence and validity of JSON Web Tokens (JWT). It extends the base
 * AuthGuard class from the @nestjs/passport library and uses the 'jwt' strategy.
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
}
