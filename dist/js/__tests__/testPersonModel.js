define(['js/components/Models/PersonModel.js'], function(PersonModel) {
    'use strict';
    function testPersonModel() {
        describe('js/components/Models/PersonModel.js', function() {

            function createPersonModel(options) {
                return new PersonModel(options);
            }       
            

            it('birthDayString возвращает строку формата "dd месяц"', function() {
                // Arrange
                let person = createPersonModel({
                    data : {
                        birth_date : '1998-02-07'
                    }
                });
                
                // Act
                let result = person.birthDayString;
        
                // Assert
                assert.equal(result, '7 февраля');
            });
            
            describe('activeString', function() {
                it('Выводит дату активности (прошлый год и раннее)', function() {
                    // Arrange
                    let person = createPersonModel({
                        computed_data : {
                            last_activity : '1975-03-04T18:02:14'
                        }
                    });
                    
                    // Act
                    let result = person.activeString;
                    
                    // Assert
                    assert.equal(result, 'Был(а) в сети 4 марта 1975 в 23:02');
                });

                it('Выводит дату активности (менее 15 минут назад)', function() {
                    // Arrange
                    let person = createPersonModel();
                    person.active = new Date();

                    // Act
                    let result = person.activeString;
    
                    // Assert
                    assert.equal(result, 'В сети');
                });

                it('Выводит дату активности сегодня (раннее 15 минут)', function() {
                    // Arrange
                    const now = new Date();
                    const beforeNow =  new Date(now - (25 * 60 * 1000));
                    let person = createPersonModel({
                        computed_data : {
                            //передаем время по гринвичу
                            last_activity : new Date(+beforeNow + (new Date().getTimezoneOffset() * 60 * 1000)),
                        }
                    });

                    // Act
                    let result = person.activeString;
    
                    // Assert
                    const hours = beforeNow.getHours() < 10 ? '0' + beforeNow.getHours() : beforeNow.getHours();
                    const minutes = beforeNow.getMinutes() < 10 ? '0' + beforeNow.getMinutes() : beforeNow.getMinutes();
                    assert.equal(result, `Был(а) в сети в ${hours}:${minutes}`);
                });
                
                it('Выводит дату активности вчера', function() {
                    // Arrange
                    const now = new Date();
                    const beforeNow =  new Date(now - (24 * 60 * 60 * 1000));
                    let person = createPersonModel({
                        computed_data : {
                            //передаем время по гринвичу
                            last_activity : new Date(+beforeNow + (new Date().getTimezoneOffset() * 60 * 1000)), 
                        }
                    });

                    // Act
                    let result = person.activeString;
    
                    // Assert
                    const hours = beforeNow.getHours() < 10 ? '0' + beforeNow.getHours() : beforeNow.getHours();
                    const minutes = beforeNow.getMinutes() < 10 ? '0' + beforeNow.getMinutes() : beforeNow.getMinutes();
                    assert.equal(result, `Был(а) в сети вчера в ${hours}:${minutes}`);
                });

            });
            it('astrologicalSign выводит знак зодиака', function() {
                // Arrange
                let person = createPersonModel({
                    data : {
                        birth_date : '1998-02-07'
                    }
                });

                // Act
                let result = person.astrologicalSign.name;

                // Assert
                assert.equal(result, `водолей`);
            });
            
            
        
        });
    }
    return testPersonModel;
});

