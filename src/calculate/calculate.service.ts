import {
    Injectable
} from '@nestjs/common';

@Injectable()
export class CalculateService {
    async put(headers, query): Promise<number> {
        switch (headers['Type-Operation']) {
            case 'plus':
                return +query.one + +query.two;
            case 'minus':
                return +query.one - +query.two;
            case 'umn':
                return +query.one * +query.two;
        }
    }

    async patch(headers): Promise<number> {
        return headers;
    }

}