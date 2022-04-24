import { Flex, Stack, Text, NumberInput, Switch } from '@chakra-ui/react';

export default function Graph({ handleChange }) {
  return (
    <Flex flexDirection="column">
      <Stack flexDirection="row" justifyContent="space-around">
        <Text>center</Text>
        <Text>x</Text>
        <NumberInput
          name="centerX"
          onChange={handleChange}
          size="sm"
          step={0.1}
        />
        <Text>y</Text>
        <NumberInput
          name="centerY"
          onChange={handleChange}
          size="sm"
          step={0.1}
        />
      </Stack>
      <Stack flexDirection="row" justifyContent="space-around">
        <Switch />
        <Text>charge</Text>
        <Text>strength</Text>
        <NumberInput name="chargeStrength" onChange={handleChange} size="sm" />
        <Text>distanceMin</Text>
        <NumberInput
          name="chargeDistanceMin"
          onChange={handleChange}
          size="sm"
        />
        <Text>distanceMax</Text>
        <NumberInput
          name="chargeDistanceMax"
          onChange={handleChange}
          size="sm"
        />
      </Stack>
      <Stack flexDirection="row" justifyContent="space-around">
        <Switch textAlign="left" />
        <Text>collide</Text>
        <Text>strength</Text>
        <NumberInput name="collideStrength" onChange={handleChange} size="sm" />
        <Text>iterations</Text>
        <NumberInput
          name="collideIterations"
          onChange={handleChange}
          size="sm"
        />
        <Text>radius</Text>
        <NumberInput name="collideRadius" onChange={handleChange} size="sm" />
      </Stack>
      <Stack flexDirection="row" justifyContent="space-around">
        <Switch textAlign="left" />
        <Text>forceX</Text>
        <Text>strength</Text>
        <NumberInput name="forceXStrength" onChange={handleChange} size="sm" />
        <Text>x</Text>
        <NumberInput name="forceXX" onChange={handleChange} size="sm" />
      </Stack>
      <Stack flexDirection="row" justifyContent="space-around">
        <Switch textAlign="left" />
        <Text>forceY</Text>
        <Text>strength</Text>
        <NumberInput name="forceYStrength" onChange={handleChange} size="sm" />
        <Text>y</Text>
        <NumberInput name="forceYY" onChange={handleChange} size="sm" />
      </Stack>
      <Stack flexDirection="row" justifyContent="space-around">
        <Switch textAlign="left" />
        <Text>link</Text>
        <Text>distance</Text>
        <NumberInput name="linkDistance" onChange={handleChange} size="sm" />
        <Text>iterations</Text>
        <NumberInput name="linkIterations" onChange={handleChange} size="sm" />
      </Stack>
    </Flex>
  );
}
