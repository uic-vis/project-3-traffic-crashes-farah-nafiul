import {Container, Row} from 'react-bootstrap'
import { BottomLeftComponent } from './BottomLeftComponent'
import { BottomRightomponent } from './BottomRightComponent'
import { TopLeftComponent } from './TopLeftComponent'
import { TopRightComponent } from './TopRightComponent'
export const ComponentContainer = ({}) =>{
    return(
        <Container fluid>
            <Row>
                <TopLeftComponent/>
                <TopRightComponent/>
            </Row>
            <Row>
                <BottomLeftComponent />
                <BottomRightomponent/>
            </Row>
        </Container>
    )
}