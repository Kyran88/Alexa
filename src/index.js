/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back pose for cobra)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    exercises = require('./exercises');

var APP_ID = "App Id Here";   // undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ExerciseHowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ExerciseHowTo.prototype = Object.create(AlexaSkill.prototype);
ExerciseHowTo.prototype.constructor = ExerciseHowTo;

ExerciseHowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Exercise How To. You can ask a question like, how do i make a cobra pose? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

ExerciseHowTo.prototype.intentHandlers = {
    "ExerciseIntent": function (intent, session, response) {
        var exerciseSlot = intent.slots.Exercise,
            exerciseName;
        if (exerciseSlot && exerciseSlot.value){
            exerciseName = exerciseSlot.value.toLowerCase();
        }

        var cardTitle = "exercise for " + exerciseName,
            exercise = exercises[exerciseName],
            speechOutput,
            repromptOutput;
        if (exercise) {
            speechOutput = {
                speech: exercise,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, exercise);
        } else {
            var speech;
            if (exerciseName) {
                speech = "I'm sorry, I currently do not know the exercise for " + exerciseName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that exercise. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using Exercise How To. Enjoy a healthy lifestyle. Alexa Out!";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using Exercise How To. Enjoy a healthy lifestyle. Alexa Out";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions about Exercises such as, how do i do Squats, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, how do i do push-ups, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var ExerciseHowTo = new ExerciseHowTo();
    ExerciseHowTo.execute(event, context);
};
